import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import EmberObject, { get } from '@ember/object';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

// the domain root `/`, which acts as authenticated "Home" of the app. Use the
// `beforeModel` hook to send unauthenticated users to the `welcome` route. This
// is why it needs the `UnauthenticatedRouteMixin`, to allow pre-processing in
// the `beforeModel` hook.
export default Route.extend(AuthenticatedRouteMixin, {
  session: service(),
  auth: service(),

  authenticationRoute: 'welcome',

  async model() {
    let { user, errors } = this.modelFor('application');
    let medias = await get(this, 'store').findAll('media');
    return EmberObject.create({
      all: medias,
      errors: errors,
      user: user
    });
  }
});
