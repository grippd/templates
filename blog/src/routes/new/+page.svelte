<script lang="ts">
  let { form } = $props();
</script>

<h1>New post</h1>
{#if form?.message}<p>{form.message}</p>{/if}
<form method="post" enctype="multipart/form-data">
  <p><input name="title" placeholder="Title" required /></p>
  <p><textarea name="body" rows="8" placeholder="Write something" required></textarea></p>
  <p><label>Cover image <input name="cover" type="file" accept="image/*" /></label></p>
  <button>Publish</button>
</form>
