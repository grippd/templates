<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head><title>Projects</title></svelte:head>

<header>Signed in as {data.email}</header>

<h1>Projects</h1>
{#if form?.message}<p>{form.message}</p>{/if}
<form method="post" action="?/create" enctype="multipart/form-data">
  <input name="name" placeholder="New project" required />
  <input name="attachment" type="file" />
  <button>Add</button>
</form>

<ul>
  {#each data.projects as project (project.id)}
    <li>
      {project.name} <small>by {project.createdBy}</small>
      {#if project.attachment}<a href="/files/{project.attachment}">attachment</a>{/if}
      <form method="post" action="?/archive" style="display: inline">
        <input type="hidden" name="id" value={project.id} />
        <button>Archive</button>
      </form>
    </li>
  {:else}
    <li>No projects yet.</li>
  {/each}
</ul>
