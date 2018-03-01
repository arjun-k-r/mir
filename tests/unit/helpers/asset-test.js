import { module, test } from 'qunit';
import config from 'mir/config/environment';
import { asset } from 'mir/helpers/asset';

module('Unit | Helper | asset', function() {
  test('it resolves absolute asset paths', function(assert) {
    let result = asset('assets/images/fun.jpg'),
      expected = '/assets/images/fun.jpg';
    assert.equal(result, expected);
  });

  test('it resolves relative asset paths', function(assert) {
    let restoreValue = config.rootURL;

    // set rootURL to relative
    config.rootURL = '';
    let result = asset('assets/images/fun.jpg'),
      expected = 'assets/images/fun.jpg';
    assert.equal(result, expected);

    // restore rootURL to relative
    config.rootURL = restoreValue;
  });
});
