import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ma-media-detail', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let model = EmberObject.create({
      title: 'asdf',
      url: 'http://example.com',
      insertedAt: 'xyz'
    });
    this.set('model', model);
    await render(hbs`{{ma-media-detail model=model}}`);
    let content = this.element.textContent.trim();
    assert.ok(content.includes('asdf'), 'includes title');
    assert.ok(content.includes('example.com'), 'includes url');

    // Template block usage:
    await render(hbs`
      {{#ma-media-detail model=model}}
        template block text
      {{/ma-media-detail}}
    `);
    content = this.element.textContent.trim();
    assert.ok(content.includes('asdf'), 'includes title');
    assert.ok(content.includes('example.com'), 'includes url');
    assert.ok(content.includes('template block text'), 'includes block text');
  });
});
