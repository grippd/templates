<script lang="ts">
  let { data } = $props();
</script>

<svelte:head><title>{data.post.title}</title></svelte:head>

<article>
  {#if data.post.cover}<img src="/files/{data.post.cover}" alt="" width="640" />{/if}
  <h1>{data.post.title}</h1>
  <p>{data.post.body}</p>
</article>
<a href="/">All posts</a>
