import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { inject as service } from '@ember/service';
import EmberObject, { get, set } from '@ember/object';

export default Route.extend(ApplicationRouteMixin, UnauthenticatedRouteMixin, {
  auth: service(),

  async model() {
    let isAuthenticated = get(this, 'session.isAuthenticated');

    // the index route is reserved for authenticated users as the "Dashboard"
    // of the app. Rather than use AuthenticatedRouteMixin which redirects users
    // to /login, we want to redirect to /welcome
    if (isAuthenticated) {
      // everyone else is sent to to `welcome` route
      return await get(this, 'auth').getUser();
    } else {
      // return an empty user
      return EmberObject.create({
        user: EmberObject.create({}),
        errors: []
      });
    }
  },

  actions: {
    async loading(transition) {
      // Toggle progress bar when transition is resolving the model promise
      let controller = this.controllerFor(this.routeName);
      set(controller, 'isLoading', true);
      await transition;
      set(controller, 'isLoading', false);
    }
  }
});
