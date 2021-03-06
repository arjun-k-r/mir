import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, fillIn, currentURL, visit } from '@ember/test-helpers';

module('Application | index', function(hooks) {
  setupApplicationTest(hooks);

  module('unauthenticated user', function(/* hooks */) {
    test('visiting / redirects to /welcome', async function(assert) {
      await visit('/');
      assert.equal(currentURL(), '/welcome');
    });

    test('visiting /styleguide redirects to /login', async function(assert) {
      await visit('/styleguide');
      assert.equal(currentURL(), '/login');
    });

    test('visiting /styleguide redirects to /login', async function(assert) {
      await visit('/styleguide');
      assert.equal(currentURL(), '/login');
    });
  });

  module('authenticated user', function(/* hooks */) {
    test('can visiting / for new users', async function(assert) {
      // create an OAuth token w/ ember-cli-mirage
      server.create('token');
      server.create('user');
      await visit('/login');
      // create account
      await fillIn('[name=email]', `mike+${new Date().getTime()}@example.com`);
      await fillIn('[name=password]', 'Password1234');
      await fillIn('[name=password_confirmation]', 'Password1234');
      await click('[data-test=signup]');
      assert.equal(currentURL(), '/');
    });
  });
});
