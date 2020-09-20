import { formSearchObject } from '@/store/modules/normalizers'
import _ from 'lodash'

describe('Form search object', () => {
  it('forms search object for regular setting', () => {
    const description = [{
      description: "Upload general settings",
      group: ":pleroma",
      key: "Pleroma.Upload",
      label: "Pleroma.Upload",
      children: [
        { description: "Module which will be used for uploads",
          key: ":uploader",
          label: "Uploader" },
        { description: "List of filter modules for uploads",
          key: ":filters",
          label: "Filters" }
      ]
    }]
    const expected = [
      { label: "Pleroma.Upload",
        key: "Pleroma.Upload",
        groupKey: "Pleroma.Upload",
        groupLabel: "Pleroma.Upload",
        search: [
          "pleroma.upload",
          "pleroma.upload",
          "upload general settings"
        ]
      },
      { label: "Uploader",
        key: ":uploader",
        groupKey: "Pleroma.Upload",
        groupLabel: "Pleroma.Upload",
        search: [
          ":uploader",
          "uploader",
          "module which will be used for uploads"
        ]
      },
      { label: "Filters",
        key: ":filters",
        groupKey: "Pleroma.Upload",
        groupLabel: "Pleroma.Upload",
        search: [
          ":filters",
          "filters",
          "list of filter modules for uploads"
        ]
      },
      {
        groupKey: ':instance_panel',
        groupLabel: 'Instance Panel',
        key: ':instance_panel',
        label: 'Instance Panel',
        search: ['Instance Panel', ':instance_panel']
      },
      {
        groupKey: ':terms_of_services',
        groupLabel: 'Terms of Services',
        key: ':terms_of_services',
        label: 'Terms of Services',
        search: ['Terms of Services', ':terms_of_services']
      }
    ]
    expect(_.isEqual(formSearchObject(description), expected)).toBeTruthy()
  })

  it('forms search object for setting without key', () => {
    const description = [{
      description: "`Swoosh.Adapters.Local` adapter specific settings",
      group: ":swoosh",
      label: "Swoosh",
      children: [
        { description: "Run the preview server together as part of your app",
          group: [":subgroup", "Swoosh.Adapters.Local"],
          key: ":serve_mailbox",
          label: "Serve mailbox"
        }
      ]
    }]
    const expected = [
      { label: "Swoosh",
        key: ":swoosh",
        groupKey: ":swoosh",
        groupLabel: "Swoosh",
        search: ["swoosh", "`swoosh.adapters.local` adapter specific settings"]
      },
      { label: "Serve mailbox",
        key: ":serve_mailbox",
        groupKey: ":swoosh",
        groupLabel: "Swoosh",
        search: [
          ":serve_mailbox",
          "serve mailbox",
          "run the preview server together as part of your app"
        ]
      },
      {
        groupKey: ':instance_panel',
        groupLabel: 'Instance Panel',
        key: ':instance_panel',
        label: 'Instance Panel',
        search: ['Instance Panel', ':instance_panel']
      },
      {
        groupKey: ':terms_of_services',
        groupLabel: 'Terms of Services',
        key: ':terms_of_services',
        label: 'Terms of Services',
        search: ['Terms of Services', ':terms_of_services']
      }
    ]
    expect(_.isEqual(formSearchObject(description), expected)).toBeTruthy()
  })

  it('forms search object for setting without key and description', () => {
    const description = [{
      group: ":cors_plug",
      label: "Cors plug",
      children: [
        { key: ":max_age",
          label: "Max age" },
        { key: ":methods",
          label: "Methods" }
      ]
    }]
    const expected = [
      { label: "Cors plug",
        key: ":cors_plug",
        groupKey: ":cors_plug",
        groupLabel: "Cors plug",
        search: ["cors plug"]
      },
      { label: "Max age",
        key: ":max_age",
        groupKey: ":cors_plug",
        groupLabel: "Cors plug",
        search: [":max_age", "max age"]
      },
      { label: "Methods",
        key: ":methods",
        groupKey: ":cors_plug",
        groupLabel: "Cors plug",
        search: [":methods", "methods"]
      },
      {
        groupKey: ':instance_panel',
        groupLabel: 'Instance Panel',
        key: ':instance_panel',
        label: 'Instance Panel',
        search: ['Instance Panel', ':instance_panel']
      },
      {
        groupKey: ':terms_of_services',
        groupLabel: 'Terms of Services',
        key: ':terms_of_services',
        label: 'Terms of Services',
        search: ['Terms of Services', ':terms_of_services']
      }
    ]
    expect(_.isEqual(formSearchObject(description), expected)).toBeTruthy()
  })

  it('forms search object for setting without key in pleroma group', () => {
    const description = [{
      description: "Allows to set a token",
      group: ":pleroma",
      label: "Pleroma",
      children: [
        { description: "Token",
          key: ":admin_token",
          label: "Admin token" }
      ]
    }]
    const expected = [{
      label: "Admin token",
      key: ":admin_token",
      groupKey: ":pleroma",
      groupLabel: "Pleroma",
      search: [":admin_token", "admin token", "token"]
    },
    {
      groupKey: ':instance_panel',
      groupLabel: 'Instance Panel',
      key: ':instance_panel',
      label: 'Instance Panel',
      search: ['Instance Panel', ':instance_panel']
    },
    {
      groupKey: ':terms_of_services',
      groupLabel: 'Terms of Services',
      key: ':terms_of_services',
      label: 'Terms of Services',
      search: ['Terms of Services', ':terms_of_services']
    }]
    expect(_.isEqual(formSearchObject(description), expected)).toBeTruthy()
  })

  it('forms search object for nested setting', () => {
    const description = [{
      description: "Media proxy",
      group: ":pleroma",
      key: ":media_proxy",
      label: "Media proxy",
      children: [
        { description: "Options for Pleroma.ReverseProxy",
        key: ":proxy_opts",
        label: "Proxy opts",
        children: [
          { description: "HTTP options",
            key: ":http",
            label: "Http",
            children: [
              { description: "Adapter specific options",
                key: ":adapter",
                label: "Adapter",
                children: [
                  { description: "SSL options for HTTP adapter",
                    key: ":ssl_options",
                    label: "SSL Options"
                  }
                ]
              }
            ]
          }
        ]}
      ]
    }]
    const expected = [
      {
        label: "Media proxy",
        key: ":media_proxy",
        groupKey: ":media_proxy",
        groupLabel: "Media proxy",
        search: [":media_proxy", "media proxy", "media proxy"]
      },
      {
        label: "Proxy opts",
        key: ":proxy_opts",
        groupKey: ":media_proxy",
        groupLabel: "Media proxy",
        search: [":proxy_opts", "proxy opts", "options for pleroma.reverseproxy"]
      },
      {
        label: "Http",
        key: ":http",
        groupKey: ":media_proxy",
        groupLabel: "Media proxy",
        search: [":http", "http", "http options"]
      },
      {
        label: "Adapter",
        key: ":adapter",
        groupKey: ":media_proxy",
        groupLabel: "Media proxy",
        search: [":adapter", "adapter", "adapter specific options"]
      },
      {
        label: "SSL Options",
        key: ":ssl_options",
        groupKey: ":media_proxy",
        groupLabel: "Media proxy",
        search: [":ssl_options", "ssl options", "ssl options for http adapter"]
      },
      {
        groupKey: ':instance_panel',
        groupLabel: 'Instance Panel',
        key: ':instance_panel',
        label: 'Instance Panel',
        search: ['Instance Panel', ':instance_panel']
      }, {
        groupKey: ':terms_of_services',
        groupLabel: 'Terms of Services',
        key: ':terms_of_services',
        label: 'Terms of Services',
        search: ['Terms of Services', ':terms_of_services']
      }
    ]
    expect(_.isEqual(formSearchObject(description), expected)).toBeTruthy()
  })
})
