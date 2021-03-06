import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  click,
  fillIn,
  currentURL,
  triggerKeyEvent,
  focus,
  blur,
  visit
} from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Application | login', function(hooks) {
  setupApplicationTest(hooks);

  module('unauthenticated user', function(/* hooks */) {
    test('can visit /login', async function(assert) {
      await visit('/login');
      assert.equal(currentURL(), '/login');
    });

    test('must supply a strong password', async function(assert) {
      await visit('/login');
      await fillIn('[name=email]', `mike+${new Date().getTime()}@example.com`);
      await fillIn('[name=password]', 'Password');
      await blur('[name=password]');
      let msg = this.element.querySelector('.ma-Login .help.is-danger')
        .textContent;
      assert.notEqual(msg.match(/Password must be between/), null);
    });

    test('cannot create an account without confirming password', async function(assert) {
      await visit('/login');
      await fillIn('[name=email]', `mike+${new Date().getTime()}@example.com`);
      await fillIn('[name=password]', 'Password1234');
      await fillIn('[name=password_confirmation]', 'a');
      await blur('[name=password_confirmation]');
      let msg = this.element.querySelector('.help.is-danger').textContent;
      assert.notEqual(msg.match(/password/), null);
      assert.dom('[data-test=signup][disabled]').exists({ count: 1 });
    });

    test('must supply a valid password', async function(assert) {
      await visit('/login');
      let maLogin = this.element.querySelector('.ma-Login');
      await fillIn('[name=email]', 'aa@bb.cc');
      await fillIn('[name=password]', 'a');
      await triggerKeyEvent(maLogin, 'keyup', 13);
      await focus('.ma-Login [data-test=login]');
      await triggerKeyEvent(maLogin, 'keyup', 13);
      assert.dom('.ma-Login button[disabled]').exists({ count: 1 });
    });

    test('can create an account with email & password', async function(assert) {
      // create an OAuth token w/ ember-cli-mirage
      server.create('token');
      server.create('user');
      // user visits login and fills in signup form
      await visit('/login');
      await fillIn('[name=email]', `mike+${new Date().getTime()}@example.com`);
      await fillIn('[name=password]', 'Password1234');
      await fillIn('[name=password_confirmation]', 'Password1234');
      // user clicks signup button
      await focus('.ma-Auth [data-test=signup]');
      await click('.ma-Auth [data-test=signup]');

      // user lands on index page
      assert.equal(currentURL(), '/');
    });

    test('cannot create an account with existing users email', async function(assert) {
      // user visits login and fills in signup form
      await visit('/login');
      await fillIn('[name=email]', 'mike@example.com');
      await fillIn('[name=password]', 'Password1234');
      await fillIn('[name=password_confirmation]', 'Password1234');
      // user clicks signup button
      await click('.ma-Auth [data-test=signup]');
      // user is still on Login page
      assert.equal(currentURL(), '/login');
    });

    test('can login to an account with email & password', async function(assert) {
      // create an OAuth token
      server.create('token');
      // user visits login and fills in signup form
      await visit('/login');
      await fillIn('[name=email]', `mike+${new Date().getTime()}@example.com`);
      await fillIn('[name=password]', 'Password1234');
      let maLogin = this.element.querySelector('.ma-Login');
      await triggerKeyEvent(maLogin, 'keyup', 13);
      // user clicks login button
      await focus('[name=email]');
      await click('.ma-Login [data-test=login]');
      // user lands on index page
      assert.equal(currentURL(), '/');
    });

    test('can click back link to Home', async function(assert) {
      // user visits login and fills in signup form
      await visit('/login');
      // user clicks signup button
      await click('.ma-Header .ma-Header-link--back');
      // user lands on welcome page
      assert.equal(currentURL(), '/welcome');
    });
  });

  module('authenticated user', function(hooks) {
    hooks.beforeEach(function() {
      authenticateSession({
        userId: 1,
        otherData: 'some-data'
      });
    });

    test('can visit /login and redirect to /', async function(assert) {
      await visit('/login');
      assert.equal(currentURL(), '/');
    });
  });
});
