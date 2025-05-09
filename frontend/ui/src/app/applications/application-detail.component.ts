import {OverlayModule} from '@angular/cdk/overlay';
import {Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  catchError,
  combineLatestWith,
  distinctUntilChanged,
  EMPTY,
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {ApplicationsService} from '../services/applications.service';
import {AsyncPipe, DatePipe, NgOptimizedImage} from '@angular/common';
import {Application, ApplicationVersion, DockerType, HelmChartType} from '@glasskube/distr-sdk';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  faArchive,
  faBox,
  faBoxesStacked,
  faCheck,
  faChevronDown,
  faEdit,
  faMagnifyingGlass,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {UuidComponent} from '../components/uuid';
import {AutotrimDirective} from '../directives/autotrim.directive';
import {EditorComponent} from '../components/editor.component';
import {getFormDisplayedError} from '../../util/errors';
import {ToastService} from '../services/toast.service';
import {disableControlsWithoutEvent, enableControlsWithoutEvent} from '../../util/forms';
import {dropdownAnimation} from '../animations/dropdown';
import {OverlayService} from '../services/overlay.service';
import {isArchived} from '../../util/dates';
import {SecureImagePipe} from '../../util/secureImage';

@Component({
  selector: 'app-application-detail',
  imports: [
    ReactiveFormsModule,
    OverlayModule,
    AsyncPipe,
    RouterLink,
    FaIconComponent,
    NgOptimizedImage,
    UuidComponent,
    AutotrimDirective,
    DatePipe,
    EditorComponent,
    SecureImagePipe,
  ],
  templateUrl: './application-detail.component.html',
  animations: [dropdownAnimation],
})
export class ApplicationDetailComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  private readonly toast = inject(ToastService);
  private readonly overlay = inject(OverlayService);
  private readonly applicationService = inject(ApplicationsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly applications$: Observable<Application[]> = this.applicationService.list();
  filterForm = new FormGroup({
    showArchived: new FormControl<boolean>(false),
  });
  readonly application$: Observable<Application | undefined> = this.route.paramMap.pipe(
    map((params) => params.get('applicationId')?.trim()),
    distinctUntilChanged(),
    tap(() => {
      this.newVersionForm.reset();
      this.newVersionFormLoading.set(false);
    }),
    combineLatestWith(this.applications$),
    map(([id, applications]) => applications.find((a) => a.id === id)),
    tap((app) => {
      this.editForm.disable();
      if (app) {
        this.editForm.patchValue({name: app.name});
        this.enableTypeSpecificGroups(app);
      }
    })
  );
  readonly visibleVersions$ = this.application$.pipe(
    combineLatestWith(this.filterForm.valueChanges.pipe(startWith({showArchived: false}))),
    map(([app, filter]) => {
      if (app && !filter.showArchived) {
        return (app.versions ?? []).filter((av) => !isArchived(av));
      }
      return app?.versions;
    })
  );

  newVersionForm = new FormGroup({
    versionName: new FormControl('', Validators.required),
    kubernetes: new FormGroup({
      chartType: new FormControl<HelmChartType>('repository', {
        nonNullable: true,
        validators: Validators.required,
      }),
      chartName: new FormControl('', Validators.required),
      chartUrl: new FormControl('', Validators.required),
      chartVersion: new FormControl('', Validators.required),
      baseValues: new FormControl(''),
      template: new FormControl(''),
    }),
    docker: new FormGroup({
      compose: new FormControl(''),
      template: new FormControl(''),
    }),
  });

  newVersionFormLoading = signal(false);
  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  editFormLoading = signal(false);

  protected readonly faBoxesStacked = faBoxesStacked;
  protected readonly faChevronDown = faChevronDown;
  protected readonly faEdit = faEdit;
  protected readonly faCheck = faCheck;
  protected readonly faXmark = faXmark;
  protected readonly faTrash = faTrash;
  protected readonly faArchive = faArchive;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faBox = faBox;
  protected readonly isArchived = isArchived;
  readonly breadcrumbDropdown = signal(false);
  readonly isVersionFormExpanded = signal(false);
  breadcrumbDropdownWidth: number = 0;
  @ViewChild('dropdownTriggerButton') dropdownTriggerButton!: ElementRef<HTMLElement>;

  @ViewChild('nameInput') nameInputElem?: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.route.url.subscribe(() => this.breadcrumbDropdown.set(false));

    this.newVersionForm.controls.kubernetes.controls.chartType.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((type) => {
        if (type === 'repository') {
          this.newVersionForm.controls.kubernetes.controls.chartName.enable();
        } else {
          this.newVersionForm.controls.kubernetes.controls.chartName.disable();
        }
      });
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  toggleBreadcrumbDropdown() {
    this.breadcrumbDropdown.update((v) => !v);
    if (this.breadcrumbDropdown()) {
      this.breadcrumbDropdownWidth = this.dropdownTriggerButton.nativeElement.getBoundingClientRect().width;
    }
  }

  enableApplicationEdit(application: Application) {
    this.editForm.enable();
    this.editForm.patchValue({name: application.name});
    setTimeout(() => this.nameInputElem?.nativeElement.focus(), 10);
  }

  cancelApplicationEdit() {
    this.editForm.disable();
  }

  async saveApplication(application: Application) {
    if (this.editForm.valid) {
      this.editFormLoading.set(true);
      try {
        await lastValueFrom(
          this.applicationService.update({
            ...application,
            name: this.editForm.value.name!.trim(),
          })
        );
      } catch (e) {
        const msg = getFormDisplayedError(e);
        if (msg) {
          this.toast.error(msg);
        }
      } finally {
        this.editFormLoading.set(false);
      }
    }
  }

  async createVersion(application: Application) {
    this.newVersionForm.markAllAsTouched();
    if (this.newVersionForm.valid && application) {
      this.newVersionFormLoading.set(true);
      let res;
      if (application.type === 'docker') {
        res = this.applicationService.createApplicationVersionForDocker(
          application,
          {name: this.newVersionForm.controls.versionName.value!},
          this.newVersionForm.controls.docker.controls.compose.value!,
          this.newVersionForm.controls.docker.controls.template.value!
        );
      } else {
        const versionFormVal = this.newVersionForm.controls.kubernetes.value;
        const version = {
          name: this.newVersionForm.controls.versionName.value!,
          chartType: versionFormVal.chartType!,
          chartName: versionFormVal.chartName ?? undefined,
          chartUrl: versionFormVal.chartUrl!,
          chartVersion: versionFormVal.chartVersion!,
        };
        res = this.applicationService.createApplicationVersionForKubernetes(
          application,
          version,
          versionFormVal.baseValues,
          versionFormVal.template
        );
      }

      try {
        const av = await firstValueFrom(res);
        this.toast.success(`${av.name} created successfully`);
        this.newVersionForm.reset();
        this.enableTypeSpecificGroups(application);
      } catch (e) {
        const msg = getFormDisplayedError(e);
        if (msg) {
          this.toast.error(msg);
        }
      } finally {
        this.newVersionFormLoading.set(false);
      }
    }
  }

  async fillVersionFormWith(application: Application, version: ApplicationVersion) {
    this.isVersionFormExpanded.set(true);
    if (application.type === 'kubernetes') {
      try {
        const template = await firstValueFrom(this.applicationService.getTemplateFile(application.id!, version.id!));
        const values = await firstValueFrom(this.applicationService.getValuesFile(application.id!, version.id!));
        this.newVersionForm.patchValue({
          kubernetes: {
            chartType: version.chartType,
            chartName: version.chartName,
            chartUrl: version.chartUrl,
            chartVersion: version.chartVersion,
            baseValues: values,
            template: template,
          },
        });
      } catch (e) {
        const msg = getFormDisplayedError(e);
        if (msg) {
          this.toast.error(msg);
        }
      }
    } else if (application.type === 'docker') {
      try {
        const template = await firstValueFrom(this.applicationService.getTemplateFile(application.id!, version.id!));
        const compose = await firstValueFrom(this.applicationService.getComposeFile(application.id!, version.id!));
        this.newVersionForm.patchValue({
          docker: {
            compose,
            template: template,
          },
        });
      } catch (e) {
        const msg = getFormDisplayedError(e);
        if (msg) {
          this.toast.error(msg);
        }
      }
    }
  }

  deleteApplication(application: Application) {
    this.overlay
      .confirm(`Really delete ${application.name}?`)
      .pipe(
        filter((result) => result === true),
        switchMap(async () => {
          await lastValueFrom(this.applicationService.delete(application));
          return this.router.navigate(['/applications']);
        }),
        catchError((e) => {
          const msg = getFormDisplayedError(e);
          if (msg) {
            this.toast.error(msg);
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  async archiveVersion(application: Application, version: ApplicationVersion) {
    this.overlay
      .confirm(`Really archive ${version.name}? Existing deployments will continue to work.`)
      .pipe(
        filter((result) => result === true),
        switchMap(() =>
          this.applicationService.updateApplicationVersion(application, {
            ...version,
            archivedAt: new Date().toISOString(),
          })
        ),
        catchError((e) => {
          const msg = getFormDisplayedError(e);
          if (msg) {
            this.toast.error(msg);
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  async unArchiveVersion(application: Application, version: ApplicationVersion) {
    try {
      await lastValueFrom(
        this.applicationService.updateApplicationVersion(application, {
          ...version,
          archivedAt: undefined,
        })
      );
    } catch (e) {
      const msg = getFormDisplayedError(e);
      if (msg) {
        this.toast.error(msg);
      }
    }
  }

  private enableTypeSpecificGroups(app: Application) {
    if (app.type === 'kubernetes') {
      enableControlsWithoutEvent(this.newVersionForm.controls.kubernetes);
      disableControlsWithoutEvent(this.newVersionForm.controls.docker);
    } else {
      enableControlsWithoutEvent(this.newVersionForm.controls.docker);
      disableControlsWithoutEvent(this.newVersionForm.controls.kubernetes);
    }
  }

  public async uploadImage(data: Application) {
    const fileId = await firstValueFrom(this.overlay.uploadImage({imageUrl: data.imageUrl}));
    if (!fileId || data.imageUrl?.includes(fileId)) {
      return;
    }
    await firstValueFrom(this.applicationService.patchImage(data.id!, fileId));
  }
}
