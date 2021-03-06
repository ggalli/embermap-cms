import {
  click,
  fillIn,
  currentURL,
  visit
} from '@ember/test-helpers';
import testId from '../helpers/test-id';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { assertionInjector } from '../assertions';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this.owner);
  });

  test('I can view the index of posts', async function(assert) {
    server.createList('post', 3);

    await visit('/posts');

    assert.dom('tbody tr').exists({ count: 3 });
  });

  test('I can edit a blog post', async function(assert) {
    let post = server.create('post', { title: 'Old post title' });

    await visit('/posts/1/edit');
    await fillIn('input', 'New post title');
    await click(testId('save'));

    post.reload();
    assert.equal(currentURL(), '/posts/1');
    assert.dom('h1').hasText('New post title');
    assert.equal(post.title, 'New post title');
  });

  test('I can delete a blog post', async function(assert) {
    server.createList('post', 3);

    await visit('/posts');

    assert.dom(testId('post-row')).exists({ count: 3 });

    await click(testId('delete'));
    await click(testId('delete-post'));

    assert.dom(testId('post-row')).exists({ count: 2 });
    assert.dom(testId('flash-message')).hasText('Post successfully deleted!');
  });

  // test("If there's a problem loading the posts, I see an error message", async function(assert) {
  //   server.createList('post', 3);
  //   server.get('/posts', { errors: [ 'The database is on vacation' ] }, 500);
  //
  //   await assert.asyncThrows(async () => {
  //     return await visit('/posts');
  //   }, 'GET /posts returned a 500');
  //
  //   assert.dom(testId('error')).hasText('The database is on vacation');
  // });

  // test('If editing a post fails, I see an error message', async function(assert) {
  //   server.create('post', { title: 'Old post title' });
  //   server.patch('/posts/:id', { errors: [ ] }, 500);
  //
  //   await visit('/posts/1/edit');
  //   await fillIn('input', 'New post title');
  //
  //   await assert.asyncThrows(async () => {
  //     return await click(testId('save'));
  //   }, 'PATCH /posts/1 returned a 500');
  //
  //   assert.dom(testId('error')).hasText('Whoops - your post was not saved');
  // });
});
