import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IHostPageLayoutService } from 'azure-devops-extension-api';

SDK.register('repository-advanced-creation', () => {
  return {
    execute: async () => {
      const service = await SDK.getService<IHostPageLayoutService>(
        CommonServiceIds.HostPageLayoutService
      );

      // Opens panel with our custom content
      service.openPanel<boolean | undefined>(
        SDK.getExtensionContext().id + '.advanced-repo-panel-content',
        {
          title: 'Create a Repository',
          description: 'Create a Repository with supplemental groups',
        }
      );
    },
  };
});

SDK.init();
