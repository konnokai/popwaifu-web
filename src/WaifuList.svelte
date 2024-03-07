<script>
  import { onDestroy } from 'svelte'
  import { Link } from 'svelte-routing'
  import { currentWaifu } from './waifu/CurrentWaifu'
  import { getWaifuList, reloadPopEvent, syncServerWaifuEvent } from './waifu/WaifuManager'
  import { i18n } from './i18n/i18n'
  import { formatNumber } from './utils/formatter'

  let waifuDataList = []
  let waiufDataUnsubscribeList = []
  $: championWaifuData = waifuDataList[0]

  $: showList = filterWaifuShowList(waifuDataList)
  const unsubscribeReloadPopEvent = reloadPopEvent.subscribe(() => { showList = showList })

  const intervalId = setInterval(sortWaifuDataList, 1000)
  onDestroy(() => {
    unsubscribeReloadPopEvent()
    clearInterval(intervalId)
  })
  function sortWaifuDataList () {
    waifuDataList.sort((a, b) => b.popCount - a.popCount)
    waifuDataList.forEach((waifuData, i) => { waifuData.ranking = i + 1 })
    waifuDataList = waifuDataList
  }

  $: reloadWaifuList($syncServerWaifuEvent)
  async function reloadWaifuList () {
    const waifuList = getWaifuList()
    waifuList.sort((a, b) => b.popCount - a.popCount)

    waiufDataUnsubscribeList.forEach((unsubscribe) => unsubscribe())
    waiufDataUnsubscribeList = []
    waifuDataList = waifuList.map((waifu, i) => {
      const waifuData = { ranking: i + 1 }
      const unsubscribe = waifu.subscribe((waifu) => waifu.assignDisplayObject(waifuData))
      waiufDataUnsubscribeList.push(unsubscribe)
      return waifuData
    })
  }

  function filterWaifuShowList (list = []) {
    const showList = list.slice(0, 30)
    const currentWaifuId = currentWaifu.get().waifuId
    const currentData = list.find((waifuData) => waifuData.waifuId === currentWaifuId)
    if (currentData && !showList.find((waifuData) => waifuData === currentData)) {
      showList.push(currentData)
    }
    return showList
  }

  function clickWaifu () {
    document.getElementById('headingWaifuListButton').click()
  }
</script>

<div class="accordion" id="accordionWaifuList">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingWaifuList">
      <button id="headingWaifuListButton" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWaifuList" aria-expanded="true" aria-controls="collapseWaifuList">
        <div class="d-flex align-items-center w-100 me-3">
          {#if championWaifuData}
            <div class="me-2">#1</div>
            <img class="header-img me-2" src="{championWaifuData.imgIconUrl}" alt="{championWaifuData.name} image" />
            <div class="flex-fill">{championWaifuData.name}</div>
            <div>{formatNumber(championWaifuData.popCount)}</div>
          {:else}
            <div>loading</div>
          {/if}
        </div>
      </button>
    </h2>
    <div id="collapseWaifuList" class="accordion-collapse collapse" aria-labelledby="headingWaifuList" data-bs-parent="#accordionWaifuList">
      <div class="accordion-body">
        <div class="board">
          <div class="list-group list-group-flush">
            {#each showList as waifu}
              <Link to="{waifu.url}" style="text-decoration: none;">
                <div class="list-group-item list-group-item-action d-flex align-items-center waifu-info me-1" on:click={clickWaifu(waifu.waifuId)}>
                  <h3 class="ranking me-2">{waifu.ranking}</h3>
                  <div class="flex-shrink-0 me-2">
                    <img class="" src="{waifu.imgIconUrl}" alt="{waifu.name} image" />
                  </div>
                  <h5 class="flex-fill">{waifu.name}</h5>
                  <div class="d-flex flex-column me-2">
                    <h5 class="text-end">{formatNumber(waifu.popCount)}</h5>
                    {#if (waifu.pps > 1 || waifu.pps < -1)}
                      <h5 class="text-end text-success">{formatNumber(waifu.pps)} pps</h5>
                    {/if}
                  </div>
                </div>
              </Link>
            {/each}
            <Link to="/" style="text-decoration: none;">
              <div class="list-group-item list-group-item-action d-flex align-items-center waifu-info me-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-arrow-left me-3" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                {i18n.showAllWaifu({ number: waifuDataList.length })}
              </div>
            </Link>
            <a href="https://github.com/SoftwareSing/popwaifu" target="_blank" style="text-decoration: none;">
              <div class="list-group-item list-group-item-action d-flex align-items-center waifu-info me-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-github me-3" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                {i18n.sourceRepoMessage()}
              </div>
            </a>
            <a href="https://github.com/konnokai/popwaifu-web" target="_blank" style="text-decoration: none;">
              <div class="list-group-item list-group-item-action d-flex align-items-center waifu-info me-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-github me-3" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                {i18n.frontendModifyRepoMessage()}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .header-img {
    object-fit: cover;
    object-position: center;
    height: 25px;
    width: 25px;
  }

  .board {
    height: 65vh;
    overflow-y: scroll;
  }

  .waifu-info {
    padding: 10px 0px;
    border: 0px;
  }

  .waifu-info img {
    object-fit: cover;
    object-position: center;
    height: 60px;
    width: 60px;
  }

  .ranking {
    min-width: 1em;
  }

  .accordion-button::after {
    transform: rotate(-180deg);
  }

  .accordion-button:not(.collapsed)::after {
    transform: rotate(0deg);
  }
</style>
