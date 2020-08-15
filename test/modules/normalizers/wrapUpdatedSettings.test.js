import { wrapUpdatedSettings } from '@/store/modules/normalizers'
import _ from 'lodash'

describe('Wrap settings', () => {
  it('wraps values without keys with type atom', () => {
    const settings = { ':level': { _value: ['atom', 'warn'] }}
    const result = wrapUpdatedSettings(':quack', settings, {})
    const expectedResult = [{ group: ':quack', key: ':level', value: ':warn' }]
    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps :backends setting in group :logger', () => {
    const settings = { ':backends': { _value:
      [['atom', 'tuple', 'module'], [':console', 'Quack.Logger', ':ex_syslogger']]
    }}
    const result = wrapUpdatedSettings(':logger', settings, {})
    const expectedResult = [{
      group: ':logger',
      key: ':backends',
      value: [':console', 'Quack.Logger', { 'tuple': ['ExSyslogger', ':ex_syslogger'] }]
    }]
    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps :types setting in group :mime', () => {
    const settings = { ':types': { _value: ['map', {
      'application/ld+json': [['list', 'string'], ['activity+json']],
      'application/xml': [['list', 'string'], ['xml']],
      'application/xrd+xml': [['list', 'string'], ['xrd+xml']]
    }]}}
    const result = wrapUpdatedSettings(':mime', settings, {})
    const expectedResult = [{
      group: ':mime',
      key: ':types',
      value: {
        'application/ld+json': ['activity+json'],
        'application/xml': ['xml'],
        'application/xrd+xml': ['xrd+xml']
      }
    }]
    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps :mascots setting in group :assets', () => {
    const settings = { ':assets': { ':mascots': [['keyword', 'map'], {
      ':pleroma_fox_tan_shy': ['', { ':mime_type': 'image/png', ':url': '/images/pleroma-fox-tan-shy.png' }],
      ':pleroma_fox_tan': ['', { ':mime_type': 'image/png', ':url': '/images/pleroma-fox-tan-smol.png' }],
    }]}}
    const state = { ':pleroma': { ':assets': {}}}
    const result = wrapUpdatedSettings(':pleroma', settings, state)
    const expectedResult = [{
      group: ':pleroma',
      key: ':assets',
      value: [{ tuple: [':mascots', [
        { tuple: [':pleroma_fox_tan_shy', { ':mime_type': 'image/png', ':url': '/images/pleroma-fox-tan-shy.png'}] },
        { tuple: [':pleroma_fox_tan', { ':mime_type': 'image/png', ':url': '/images/pleroma-fox-tan-smol.png'}] }
      ]]}]
    }]
    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps settings with type keyword', () => {
    const settings1 = { 'Pleroma.Upload': { ':proxy_opts':
      [ 'keyword', {
        ':redirect_on_failure': ['boolean', true],
        ':http': ['keyword', { ':proxy_url': [['string', 'tuple'], 'localhost:3090' ]}]
      }]
    }}
    const state1 = { ':pleroma': { 'Pleroma.Upload': {}}}
    const result1 = wrapUpdatedSettings(':pleroma', settings1, state1)
    const expectedResult1 = [{
      group: ':pleroma',
      key: 'Pleroma.Upload',
      value: [{ tuple: [':proxy_opts', [
        { tuple: [':redirect_on_failure', true] },
        { tuple: [':http', [{ tuple: [':proxy_url', 'localhost:3090'] }]] }
      ]]}]
    }]

    const settings2 = { ':media_proxy': { ':proxy_opts':
      ['keyword', {
        ':max_body_length': ['integer', 26210000],
        ':http': ['keyword', {
          ':proxy_url': [['string', 'tuple'], [':socks5', '127.0.0.1', '9020']],
          ':adapter': ['keyword', {
            ':ssl_options': ['keyword', {
              ':versions': [['list', 'atom'], [':tlsv1', ':tlsv1.1']]
            }]
          }]
        }]
      }]
    }}
    const state2 = { ':pleroma': { ':media_proxy': {}}}
    const result2 = wrapUpdatedSettings(':pleroma', settings2, state2)
    const expectedResult2 = [{
      group: ':pleroma',
      key: ':media_proxy',
      value: [{ tuple: [':proxy_opts', [
        { tuple: [':max_body_length', 26210000] },
        { tuple: [':http',
          [{ tuple: [ ':proxy_url', { tuple: [ ':socks5', '127.0.0.1', '9020' ] }]},
          { tuple: [':adapter',
            [{ tuple: [':ssl_options', [{ tuple: [':versions', [':tlsv1', ':tlsv1.1']]}]]}]
          ]}]
        ]}
      ]]}]
    }]

    expect(_.isEqual(result1, expectedResult1)).toBeTruthy()
    expect(_.isEqual(result2, expectedResult2)).toBeTruthy()
  })

  it('wraps settings that includes keyword in type', () => {
    const settings1 = { 'Oban': { ':queues': [
      ['keyword', 'integer'],
      { ':activity_expiration': ['integer', 15],
        ':background': ['integer', 10],
        ':federator_incoming': ['integer', 30]}
    ]}}
    const state1 = { ':pleroma': { 'Oban': {}}}
    const result1 = wrapUpdatedSettings(':pleroma', settings1, state1)
    const expectedResult1 = [{
      group: ':pleroma',
      key: 'Oban',
      value: [{ tuple: [':queues', [
        { tuple: [':activity_expiration', 15] },
        { tuple: [':background', 10] },
        { tuple: [':federator_incoming', 30]}
      ]]}]
    }]

    const settings2 = { ':emoji': { ':groups': [
      ['keyword', ['list', 'string']],
      { ':custom': [['list'], ['/emoji/*.png', '/emoji/**/*.png']],
        ':another_group': ['list', ['/custom_emoji/*.png']]}
    ]}}
    const state2 = { ':pleroma': { ':emoji': {}}}
    const result2 = wrapUpdatedSettings(':pleroma', settings2, state2)
    const expectedResult2 = [{
      group: ':pleroma',
      key: ':emoji',
      value: [{ tuple: [':groups', [
        { tuple: [':custom', ['/emoji/*.png', '/emoji/**/*.png']]},
        { tuple: [':another_group', ['/custom_emoji/*.png']]}
      ]]}]
    }]

    expect(_.isEqual(result1, expectedResult1)).toBeTruthy()
    expect(_.isEqual(result2, expectedResult2)).toBeTruthy()
  })

  it('wraps :replace setting', () => {
    const settings = { ':mrf_keyword': { ':replace': [
      ['list', 'tuple'],
      { 'pattern': ['list', 'replacement'],
        '/\w+/': ['list', 'test_replacement']}
    ]}}
    const state = { ':pleroma': { ':mrf_keyword': {}}}
    const result = wrapUpdatedSettings(':pleroma', settings, state)
    const expectedResult = [{
      group: ':pleroma',
      key: ':mrf_keyword',
      value: [{ tuple: [':replace', [
        { tuple: ['pattern', 'replacement'] },
        { tuple: ['/\w+/', 'test_replacement'] }
      ]]}]
    }]

    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps settings with type atom', () => {
    const settings = {
      ':ldap': { ':sslopts': [ 'keyword', { ':verify': ['atom', 'verify_peer']}]},
      ':assets': { ':default_mascot': ['atom', 'pleroma_fox_tan_test']}
    }
    const state = { ':pleroma': { ':sslopts': {}, ':assets': {}}}
    const result = wrapUpdatedSettings(':pleroma', settings, state)
    const expectedResult = [{
      group: ':pleroma',
      key: ':ldap',
      value: [{ tuple: [':sslopts', [{tuple: [':verify', ':verify_peer']}]]}]
    }, {
      group: ':pleroma',
      key: ':assets',
      value: [{ tuple: [':default_mascot', ':pleroma_fox_tan_test']}]
    }]

    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps settings with type string and tuple', () => {
    const settings1 = { ':media_proxy': { ':proxy_opts':
      ['keyword', {
        ':http': ['keyword', { ':proxy_url': [['string', 'tuple'], 'localhost:9020']}]
      }]
    }}
    const state1 = { ':pleroma': { ':media_proxy': {}}}
    const result1 = wrapUpdatedSettings(':pleroma', settings1, state1)
    const expectedResult1 = [{
      group: ':pleroma',
      key: ':media_proxy',
      value: [{ tuple: [':proxy_opts', [
        { tuple: [':http',
          [{ tuple: [':proxy_url', 'localhost:9020'] }]
        ]}
      ]]}]
    }]

    const settings2 = { ':media_proxy': { ':proxy_opts':
      ['keyword', {
        ':http': ['keyword', { ':proxy_url': [['string', 'tuple'], [':socks5', '127.0.0.1', '9020']]}]
      }]
    }}
    const state2 = { ':pleroma': { ':media_proxy': {}}}
    const result2 = wrapUpdatedSettings(':pleroma', settings2, state2)
    const expectedResult2 = [{
      group: ':pleroma',
      key: ':media_proxy',
      value: [{ tuple: [':proxy_opts', [
        { tuple: [':http',
          [{ tuple: [ ':proxy_url', { tuple: [':socks5', '127.0.0.1', '9020'] }]}]
        ]}
      ]]}]
    }]

    expect(_.isEqual(result1, expectedResult1)).toBeTruthy()
    expect(_.isEqual(result2, expectedResult2)).toBeTruthy()
  })

  it('wraps settings with type atom and tuple', () => {
    const settings1 = { 'Oban': { ':prune': [['atom', 'tuple'], ':disabled']}}
    const state1 = { ':pleroma': { 'Oban': {}}}
    const result1 = wrapUpdatedSettings(':pleroma', settings1, state1)
    const expectedResult1 = [{
      group: ':pleroma',
      key: 'Oban',
      value: [{ tuple: [':prune', ':disabled']}]
    }]

    const settings2 = { 'Oban': { ':prune':
      [['atom', 'tuple'], [':maxlen', 1500]]
    }}
    const state2 = { ':pleroma': { 'Oban': {}}}
    const result2 = wrapUpdatedSettings(':pleroma', settings2, state2)
    const expectedResult2 = [{
      group: ':pleroma',
      key: 'Oban',
      value: [{ tuple: [':prune', {tuple: [':maxlen', 1500]}]}]
    }]

    expect(_.isEqual(result1, expectedResult1)).toBeTruthy()
    expect(_.isEqual(result2, expectedResult2)).toBeTruthy()
  })

  it('wraps settings with type map', () => {
    const settings1 = { ':instance': { ':poll_limits': ['map', { ':min_expiration': ['integer', 100] }]}}
    const state1 = { ':pleroma': { ':instance': { ':poll_limits': {
      ':max_expiration': 31536000,
      ':max_option_chars': 200,
      ':max_options': 20,
      ':min_expiration': 100
    }}}}
    const result1 = wrapUpdatedSettings(':pleroma', settings1, state1)
    const expectedResult1 = [{
      group: ':pleroma',
      key: ':instance',
      value: [{ tuple: [':poll_limits', {
        ':max_expiration': 31536000,
        ':max_option_chars': 200,
        ':max_options': 20,
        ':min_expiration': 100
      }]}]
    }]

    const settings2 = { ':email_notifications': { ':digest': ['map', {
      ':active': ['boolean', true],
      ':schedule': ['string', '0 0  0'],
      ':inactivity_threshold': ['integer', 10]
    }]}}
    const state2 = { ':pleroma': { ':email_notifications': { ':digest': {
      ':active': true,
      ':inactivity_threshold': 10,
      ':interval': 7,
      ':schedule': '0 0  0'
    }}}}
    const result2 = wrapUpdatedSettings(':pleroma', settings2, state2)
    const expectedResult2 = [{
      group: ':pleroma',
      key: ':email_notifications',
      value: [{ tuple: [':digest', {
        ':active': true,
        ':inactivity_threshold': 10,
        ':interval': 7,
        ':schedule': '0 0  0'
      }]}]
    }]

    expect(_.isEqual(result1, expectedResult1)).toBeTruthy()
    expect(_.isEqual(result2, expectedResult2)).toBeTruthy()
  })

  it('wraps settings with type that includes map', () => {
    const settings1 = { ':mrf_subchain': { ':match_actor': [['map', ['list', 'string']], {
      '~r/https:\/\/example.com/s': ['list', ['Elixir.Pleroma.Web.ActivityPub.MRF.DropPolicy']],
      '~r/https:\/\/test.com': ['list', ['Elixir.Pleroma.Web.ActivityPub.MRF.TestPolicy']]
    }]}}
    const state1 = { ':pleroma': { ':mrf_subchain': { ':match_actor': [
      { '~r/https:\/\/example.com/s': { value: ['Elixir.Pleroma.Web.ActivityPub.MRF.DropPolicy'], id: '1234' }},
      { '~r/https:\/\/test.com': { value: ['Elixir.Pleroma.Web.ActivityPub.MRF.TestPolicy'], id: '5678' } }
    ]
    }}}

    const result1 = wrapUpdatedSettings(':pleroma', settings1, state1)
    const expectedResult1 = [{
      group: ':pleroma',
      key: ':mrf_subchain',
      value: [{ tuple: [':match_actor', {
        '~r/https:\/\/example.com/s': ['Elixir.Pleroma.Web.ActivityPub.MRF.DropPolicy'],
        '~r/https:\/\/test.com': ['Elixir.Pleroma.Web.ActivityPub.MRF.TestPolicy']
      }]}]
    }]

    const settings2 = { 'Pleroma.Web.MediaProxy.Invalidation.Http': { 
      ':options': ['keyword', { ':params': [['map', 'string'], { aaa: ['list', 'bbb'], xxx: ['list', 'zzz'] }]}]
    }}
    const state2 = { ':pleroma': { 'Pleroma.Web.MediaProxy.Invalidation.Http': { 
      ':options': { ':params': [{ aaa: { value: 'bbb', id: '1' }, xxx: { value: 'zzz', id: '2' }}] }
    }}}

    const result2 = wrapUpdatedSettings(':pleroma', settings2, state2)
    const expectedResult2 = [{
      group: ':pleroma',
      key: 'Pleroma.Web.MediaProxy.Invalidation.Http',
      value: [{ tuple: [':options', [
        { tuple: [':params', { aaa: 'bbb', xxx: 'zzz' }]}
      ]]}]
    }]

    expect(_.isEqual(result1, expectedResult1)).toBeTruthy()
    expect(_.isEqual(result2, expectedResult2)).toBeTruthy()
  })

  it('wraps IP setting', () => {
    const settings = { ':gopher': { ':ip': ['tuple', '127.0.0.1']}}
    const state = { ':pleroma': { ':gopher': {}}}
    const result = wrapUpdatedSettings(':pleroma', settings, state)
    const expectedResult = [{
      group: ':pleroma',
      key: ':gopher',
      value: [{ tuple: [':ip', { tuple: [127, 0, 0, 1] }]}]
    }]

    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps args setting in Pleroma.Upload.Filter.Mogrify group', () => {
    const settings = { 'Pleroma.Upload.Filter.Mogrify': { ':args': [
      ['string', ['list', 'string'], ['list', 'tuple']],
      ['strip', '{ "implode", "1"]}']
    ]}}
    const state = { ':pleroma': { 'Pleroma.Upload.Filter.Mogrify': {}}}
    const result = wrapUpdatedSettings(':pleroma', settings, state)
    const expectedResult = [{
      group: ':pleroma',
      key: 'Pleroma.Upload.Filter.Mogrify',
      value: [{tuple: [':args', ['strip', '{ "implode", "1"]}']]}]
    }]

    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })

  it('wraps regular settings', () => {
    const settings = { ':http_security': {
      ':report_uri': ['string', 'https://test.com'],
      ':ct_max_age': ['integer', 150000],
      ':sts': ['boolean', true],
      ':methods': [['list', 'string'], ['POST', 'PUT', 'PATCH']]
    }}
    const state = { ':pleroma': { ':http_security': {}}}
    const result = wrapUpdatedSettings(':pleroma', settings, state)
    const expectedResult = [{
      group: ':pleroma',
      key: ':http_security',
      value: [
        { tuple: [':report_uri', 'https://test.com'] },
        { tuple: [':ct_max_age', 150000] },
        { tuple: [':sts', true] },
        { tuple: [':methods', ['POST', 'PUT', 'PATCH']] }
      ]
    }]

    expect(_.isEqual(result, expectedResult)).toBeTruthy()
  })
})
