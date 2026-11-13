<script lang="ts">
  let { data } = $props();
</script>

<svelte:head><title>Blog</title></svelte:head>

<h1>Blog</h1>
{#each data.posts as post (post.slug)}
  <p><a href="/{post.slug}">{post.title}</a> <small>{post.publishedAt.toDateString()}</small></p>
{:else}
  <p>No posts yet. Write one at <a href="/new">/new</a> while running <code>grippd dev</code>.</p>
{/each}
