<script>
  import { Router, Route, navigate } from 'svelte-routing'
  import HomePage from './HomePage.svelte'
  import WaifuPopPage from './WaifuPopPage.svelte'
  import ExamplePage from './ExamplePage.svelte'
  import SubmitWaifuNotAvailableModal from './SubmitWaifuNotAvailableModal.svelte'

  export let url = ''
  window.__navigator = navigate
  let homePageScrollY
</script>

<Router url="{url}">
  <div class="app">
    <Route path="/example" component="{ExamplePage}" />
    <Route path="/:urlId/:mode" component="{WaifuPopPage}" />
    <Route path="/:urlId" component="{WaifuPopPage}" />
    <Route path="/">
      <HomePage bind:scrollY={homePageScrollY} />
    </Route>
  </div>
</Router>

<style>
  .app {
    position: relative;
  }
</style>
