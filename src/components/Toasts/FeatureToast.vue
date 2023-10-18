<template>
  <div class="modal-wpr" v-show="showHelp">

    <div :class="`modal ${flyerOrientation}`" v-click-outside="closeHelp" >
      <div class="header">
        <h2>{{ content.howto.help }}</h2>
        <a class="close-btn" @click="toggleHelp(false)">
          <img alt="close" src="/images/icon-close-white.svg">
        </a>
      </div>

      <div class="content" ref="toastContent">
        <scroll-container
            :enable-scroll-bars="true"
            :max-width="2000"
            align="center"
            :fit-axis="'x'"
            :enable-scroll-buttons="false"
            @ready="onScrollReady"
            :sync-global-zoom="false"
        >

          <div :class="`content-container ${flyerOrientation}`">
            <help-screen />
<!--            <div class="desktop">
              <div :class="`${flyerOrientation}`">
                <div>
                  <FeatureHeading>{{ content.howto.tip }}</FeatureHeading>
                  <div class="feature">
                    &lt;!&ndash; Flyer List (Sidebar) &ndash;&gt;
                    <div class="description">
                      <div class="button-preview">
													<img src="/icons/icon-flyerdrawer_v1.svg" />
&lt;!&ndash;                          <span class="pull-button"
                                data-tour-item="sidebar"
                                aria-label="Sidebar Pull Button"
                                :class="{fr:language=='fr'}"
                          >
                           <span class="flyericon-text" :class="{fr:language=='fr'}">
                              <img src="/images/icon-flyer.svg" class="flyer-book" width="16px" height="14px" style="opacity:1" :alt="content.seeOtherFlyers" />
                             <span class="seeOtherFlyers" style="font-size:9px;text-align: left">{{content.seeOtherFlyers}}</span>
                           </span>
                           <span>
                            <img src="/images/right-arrow-only.svg" class="arrow" :class="{fr:language=='fr'}" width="12px" height="12px" :alt="content.openSideBar" />
                           </span>
                        </span>&ndash;&gt;

                        <h4 class="desktop">{{ content.howto.flyerList }}</h4>
                        <h4 class="mobile">{{ content.howto.flyerList }}</h4>
                        <div class="subtitle desktop">{{ content.howto.flyerListSubtitle }}</div>
                        <div class="subtitle mobile">{{ content.howto.flyerListSubtitle }}</div>
                      </div>
                    </div>


                    &lt;!&ndash; Search & filter &ndash;&gt;
                    <div class="description">
                      <div class="button-preview">
                        <button :aria-label="content.howto.searchBtn" class="search-toggle btn has-tooltip">

                          <svg data-v-29e8c3c6="" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512">
                            <path data-v-29e8c3c6="" fill="currentColor" d="M495 466.2L377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8zm-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4z"></path>
                          </svg>
                        </button>
                        <h4 class="desktop">{{ content.howto.search }}</h4>
                        <h4 class="mobile">{{ content.howto.searchMob }}</h4>
                        <div class="subtitle desktop">{{ content.howto.filter }}</div>
                        <div class="subtitle mobile">{{ content.howto.filterMob }}</div>
                      </div>
                    </div>

                    <div class="description desktop">
                      <div class="button-preview">
                        <a class="pdf-btn btn has-tooltip">
                          <img alt="Download PDF" src="/images/icon-pdf.svg">
                        </a>
                        <h4>{{ content.howto.pdf }}</h4>
                        <div class="subtitle">{{ content.howto.download }}</div>
                      </div>
                    </div>

                    &lt;!&ndash;OTHER FLYERS &ndash;&gt;
&lt;!&ndash;                    <div class="description">&ndash;&gt;
&lt;!&ndash;                      <div class="button-preview">&ndash;&gt;
&lt;!&ndash;                        <button aria-label="other flyers" class="other-btn btn">&ndash;&gt;
&lt;!&ndash;                          <svg width="24" height="17" xmlns="http://www.w3.org/2000/svg">&ndash;&gt;
&lt;!&ndash;                            <g fill-rule="nonzero" fill="none">&ndash;&gt;
&lt;!&ndash;                              <path d="M23.53 1.38h-1.58V.86c.01-.2-.13-.39-.33-.45C20.52.14 19.4 0 18.26 0 16.4 0 13.86.4 12 2.25 10.13.39 7.58 0 5.72 0 4.6 0 3.46.14 2.37.41a.45.45 0 00-.34.45v.52H.47c-.26 0-.47.2-.47.45v14.35c0 .25.2.45.47.45.08 0 .15-.02.22-.06.05-.02 4.7-2.48 11.2-.9H12.1c6.52-1.6 11.17.86 11.2.9.15.08.32.08.47 0a.45.45 0 00.23-.39V1.83c0-.24-.2-.45-.47-.45z" fill="#545454"/>&ndash;&gt;
&lt;!&ndash;                              <g fill="#FFF">&ndash;&gt;
&lt;!&ndash;                                <path d="M5.36 12.6a19 19 0 00-2.36.16V1.3C3.84 1.09 4.7 1 5.57 1 7.2 1 9.43 1.38 11 3.14L11 14c-.9-.6-2.66-1.4-5.64-1.4zM13 3.14C14.56 1.39 16.8 1 18.42 1a12 12 0 012.58.29v11.48c-.78-.1-1.56-.16-2.35-.16-2.96 0-4.73.8-5.65 1.39V3.14z"/>&ndash;&gt;
&lt;!&ndash;                              </g>&ndash;&gt;
&lt;!&ndash;                            </g>&ndash;&gt;
&lt;!&ndash;                          </svg>&ndash;&gt;
&lt;!&ndash;                        </button>&ndash;&gt;
&lt;!&ndash;                        <h4>{{ content.howto.other }}</h4>&ndash;&gt;
&lt;!&ndash;                        <div class="subtitle">{{ content.howto.click }}</div>&ndash;&gt;
&lt;!&ndash;                      </div>&ndash;&gt;
&lt;!&ndash;                    </div>&ndash;&gt;


                    &lt;!&ndash; Shopping List &ndash;&gt;
&lt;!&ndash;                    <div class="description">&ndash;&gt;
&lt;!&ndash;                      <div class="button-preview">&ndash;&gt;
&lt;!&ndash;                        <button aria-label="other flyers" class="other-btn btn">&ndash;&gt;
&lt;!&ndash;                          &lt;!&ndash; <span class="notify-badge">0</span> &ndash;&gt;&ndash;&gt;
&lt;!&ndash;                          <svg width="34px" height="34px" viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">&ndash;&gt;
&lt;!&ndash;                            <g id="-Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">&ndash;&gt;
&lt;!&ndash;                              <g id="SuperC-header-&#45;&#45;English" transform="translate(-1868.000000, -23.000000)">&ndash;&gt;
&lt;!&ndash;                                <g id="icon-&#45;&#45;list" transform="translate(1868.000000, 23.000000)">&ndash;&gt;
&lt;!&ndash;                                  <path d="M30,0 C32.209139,0 34,1.790861 34,4 L34,30 C34,32.209139 32.209139,34 30,34 L4,34 C1.790861,34 0,32.209139 0,30 L0,4 C0,1.790861 1.790861,0 4,0 L30,0 Z M30,1 L4,1 C2.40231912,1 1.09633912,2.24891996 1.00509269,3.82372721 L1,4 L1,30 C1,31.5976809 2.24891996,32.9036609 3.82372721,32.9949073 L4,33 L30,33 C31.5976809,33 32.9036609,31.75108 32.9949073,30.1762728 L33,30 L33,4 C33,2.40231912 31.75108,1.09633912 30.1762728,1.00509269 L30,1 Z" id="Rectangle-Copy-14" fill="" fill-rule="nonzero"></path>&ndash;&gt;
&lt;!&ndash;                                  <g id="Group" transform="translate(7.000000, 9.000000)" fill="#545454">&ndash;&gt;
&lt;!&ndash;                                    <rect id="Rectangle-Copy-34" x="6" y="0" width="14" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                                    <rect id="Rectangle-Copy-37" x="0" y="0" width="3" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                                    <rect id="Rectangle-Copy-35" x="6" y="7" width="14" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                                    <rect id="Rectangle-Copy-38" x="0" y="7" width="3" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                                    <rect id="Rectangle-Copy-36" x="6" y="14" width="14" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                                    <rect id="Rectangle-Copy-39" x="0" y="14" width="3" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                                  </g>&ndash;&gt;
&lt;!&ndash;                                </g>&ndash;&gt;
&lt;!&ndash;                              </g>&ndash;&gt;
&lt;!&ndash;                            </g>&ndash;&gt;
&lt;!&ndash;                          </svg>&ndash;&gt;
&lt;!&ndash;                        </button>&ndash;&gt;
&lt;!&ndash;                        <h4>{{ content.howto.shoppingList }}</h4>&ndash;&gt;
&lt;!&ndash;                        <div class="subtitle">{{ content.howto.shoppingListText }}</div>&ndash;&gt;
&lt;!&ndash;                      </div>&ndash;&gt;
&lt;!&ndash;                    </div>&ndash;&gt;


                    &lt;!&ndash; details &ndash;&gt;
                    <div class="description">
                      <div class="button-preview">
                        <img alt="" width="22px" src="/icons/icon-hand-point.svg" />
                        <h4>{{ content.howto.details }}</h4>
                        <div class="subtitle">{{ content.howto.detailsText }}</div>
                      </div>
                    </div>

                  </div>
                </div>


                <div class="section-group">
                  &lt;!&ndash; Navigation Desktop &ndash;&gt;
                  <div>
                    <FeatureHeading>{{ content.howto.nav }}</FeatureHeading>
                    <div class="feature navigation">
                      <div class="description desktop">
                        <div class="button-preview">
                          <div class="btn btn&#45;&#45;lg page">
                            <div class="page-num">Page 5 OF 30</div>
                          </div>

                          <h4>{{ content.howto.pageScroll }}</h4>
                          <div class="subtitle">{{ content.howto.scroll }}</div>
                        </div>
                      </div>
                      <div class="description desktop">
                        <div class="button-preview">
                          <img alt="" src="/icons/icon-onefinger-dragall.svg" />
                          <h4>{{ content.howto.drag }}</h4>
                          <div class="subtitle">{{ content.howto.dragText }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  &lt;!&ndash; View Options Desktop &ndash;&gt;
                  <div>
                    <FeatureHeading>{{ content.howto.screen }}</FeatureHeading>
                    <div class="feature">
                      <div class="description desktop">
                        <div class="button-preview">
                          <div class="zoom-group" data-tour-item="zoom">
                            <button class="zoom-out" :aria-label="content.zoomOut" disabled><img :alt="content.zoomOut" src="/images/icon-decrease.svg" /></button>
                            <div class="zoom-percent">100%</div>
                            <button class="zoom-in" :aria-label="content.zoomIn" disabled><img :alt="content.zoomIn" src="/images/icon-increase.svg" /></button>
                            <button class="zoom-100" :aria-label="content.resetZoom" disabled>
                              <svg width="22" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 01-2.8-.7l-1.46 1.46A7.93 7.93 0 0011 16c4.42 0 8-3.58 8-8h3l-4-4zM5 8c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0011 0C6.58 0 3 3.58 3 8H0l4 4 4-4H5z" fill="currentColor" fill-rule="nonzero"/></svg>
                              &lt;!&ndash; <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-ccw">
                                <path d="M1 4v6h6M23 20v-6h-6"/>
                                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
                              </svg> &ndash;&gt;
                            </button>
                          </div>
                          &lt;!&ndash; <div class="zoom-group">
                            <button aria-label="Zoom Out" class="zoom-out has-tooltip">
                              <img alt="Zoom Out" src="/images/icon-decrease-size.svg">
                            </button>
                            <button aria-label="Reset Zoom" disabled="disabled" class="zoom-100 has-tooltip">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-ccw">
                                <path data-v-29e8c3c6="" d="M1 4v6h6M23 20v-6h-6"></path>
                                <path data-v-29e8c3c6="" d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"></path>
                              </svg>
                            </button>
                            <button aria-label="Zoom In" class="zoom-in has-tooltip">
                              <img alt="Zoom In" src="/images/icon-increase-size.svg">
                            </button>
                          </div> &ndash;&gt;
                          <h4>{{ content.howto.zoom }}</h4>
                          <div class="subtitle">{{ content.howto.symbols }}</div>
                        </div>
                      </div>
                      <div class="description desktop">
                        <div class="button-preview">
                          <div class="btn btn&#45;&#45;lg">
                            <svg width="24" height="30" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.57 15.57v-7.8H10.3v7.8H6.86L11.43 20 16 15.57h-3.43zM4.57 0L0 4.43h3.43v7.8H5.7v-7.8h3.43L4.57 0z" fill="currentColor" fill-rule="nonzero"/>
                            </svg>
                          </div>
                          <h4>{{ content.howto.toggle }}</h4>
                          <div class="subtitle">{{ content.howto.horizontal }}</div>
                        </div>
                      </div>
                      <div class="description desktop">
                        <div class="button-preview">
                          <div class="btn btn&#45;&#45;lg">
                            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                              <path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z" fill="currentColor" fill-rule="nonzero"></path>
                            </svg>
                          </div>
                          <h4>{{ content.howto.fullscreen }}</h4>
                          <div class="subtitle">{{ content.howto.fullscreenText }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class="mobile">
              &lt;!&ndash; Flyer List &ndash;&gt;
              <div class="description">
                <div style="">
                  <span class="pull-button"
                        data-tour-item="sidebar"
                        aria-label="Sidebar Pull Button"
                        :class="{fr:language=='fr'}"
                  >
                           <span class="flyericon-text" :class="{fr:language=='fr'}">
                              <img src="/images/icon-flyer.svg" class="flyer-book" width="16px" height="14px" style="opacity: 1" :alt="content.seeOtherFlyers" />
                             <span class="seeOtherFlyers" style="font-size:9px">{{content.seeOtherFlyers}}</span>
                           </span>
                           <span>
                            <img src="/images/right-arrow-only.svg" class="arrow" :class="{fr:this.language=='fr'}" width="12px" height="12px" :alt="content.openSideBar" />
                           </span>
                        </span>
                </div>
                <div class="mobile-content">
                  <h4>{{ content.howto.flyerList }}</h4>
                  <div class="subtitle">{{ content.howto.flyerListSubtitle }}</div>
                </div>
              </div>

              &lt;!&ndash; Other Flyers Mobile &ndash;&gt;
&lt;!&ndash;              <div class="description">&ndash;&gt;
&lt;!&ndash;                <div><button aria-label="other flyers" class="other-btn btn">&ndash;&gt;
&lt;!&ndash;                  <svg width="24" height="17" xmlns="http://www.w3.org/2000/svg">&ndash;&gt;
&lt;!&ndash;                    <g fill-rule="nonzero" fill="none">&ndash;&gt;
&lt;!&ndash;                      <path d="M23.53 1.38h-1.58V.86c.01-.2-.13-.39-.33-.45C20.52.14 19.4 0 18.26 0 16.4 0 13.86.4 12 2.25 10.13.39 7.58 0 5.72 0 4.6 0 3.46.14 2.37.41a.45.45 0 00-.34.45v.52H.47c-.26 0-.47.2-.47.45v14.35c0 .25.2.45.47.45.08 0 .15-.02.22-.06.05-.02 4.7-2.48 11.2-.9H12.1c6.52-1.6 11.17.86 11.2.9.15.08.32.08.47 0a.45.45 0 00.23-.39V1.83c0-.24-.2-.45-.47-.45z" fill="#545454"/>&ndash;&gt;
&lt;!&ndash;                      <g fill="#FFF">&ndash;&gt;
&lt;!&ndash;                        <path d="M5.36 12.6a19 19 0 00-2.36.16V1.3C3.84 1.09 4.7 1 5.57 1 7.2 1 9.43 1.38 11 3.14L11 14c-.9-.6-2.66-1.4-5.64-1.4zM13 3.14C14.56 1.39 16.8 1 18.42 1a12 12 0 012.58.29v11.48c-.78-.1-1.56-.16-2.35-.16-2.96 0-4.73.8-5.65 1.39V3.14z"/>&ndash;&gt;
&lt;!&ndash;                      </g>&ndash;&gt;
&lt;!&ndash;                    </g>&ndash;&gt;
&lt;!&ndash;                  </svg>&ndash;&gt;
&lt;!&ndash;                </button></div>&ndash;&gt;
&lt;!&ndash;                <div class="mobile-content">&ndash;&gt;
&lt;!&ndash;                  <h4>{{ content.howto.other }}</h4>&ndash;&gt;
&lt;!&ndash;                  <div class="subtitle">{{ content.howto.click }}</div>&ndash;&gt;
&lt;!&ndash;                </div>&ndash;&gt;
&lt;!&ndash;              </div>&ndash;&gt;

              &lt;!&ndash; Search Mobile &ndash;&gt;
              <div class="description">
                <div><button aria-label="Toggle Search" class="search-toggle btn has-tooltip">
                  <span class="desktop">{{ content.howto.searchBtn }}</span>
                  <svg data-v-29e8c3c6="" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512">
                    <path data-v-29e8c3c6="" fill="currentColor" d="M495 466.2L377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8zm-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4z"></path>
                  </svg>
                </button></div>
                <div class="mobile-content">
                  <h4>{{ content.howto.searchMob }}</h4>
                  <div class="subtitle">{{ content.howto.filterMob }}</div>
                </div>
              </div>


              &lt;!&ndash; Filters mobile&ndash;&gt;
&lt;!&ndash;              <div class="description">&ndash;&gt;
&lt;!&ndash;                <div><button aria-label="" class="btn">&ndash;&gt;
&lt;!&ndash;                  <svg width="18" height="16" xmlns="http://www.w3.org/2000/svg">&ndash;&gt;
&lt;!&ndash;                    <g fill="currentColor" fill-rule="evenodd">&ndash;&gt;
&lt;!&ndash;                      <path d="M0 15h18v-2H0v2zM0 1v2h18V1H0zm0 8h18V7H0v2z" fill-rule="nonzero"></path>&ndash;&gt;
&lt;!&ndash;                      <circle cx="14" cy="2" r="2"></circle>&ndash;&gt;
&lt;!&ndash;                      <circle cx="4" cy="8" r="2"></circle>&ndash;&gt;
&lt;!&ndash;                      <circle cx="11" cy="14" r="2"></circle>&ndash;&gt;
&lt;!&ndash;                    </g>&ndash;&gt;
&lt;!&ndash;                  </svg>&ndash;&gt;
&lt;!&ndash;                </button></div>&ndash;&gt;
&lt;!&ndash;                <div class="mobile-content">&ndash;&gt;
&lt;!&ndash;                  <h4>{{ content.howto.filterSingle }}</h4>&ndash;&gt;
&lt;!&ndash;                  <div class="subtitle">{{ content.howto.filterSingleText }}</div>&ndash;&gt;
&lt;!&ndash;                </div>&ndash;&gt;
&lt;!&ndash;              </div>&ndash;&gt;

              &lt;!&ndash; Full Screen Mobile &ndash;&gt;
              <div class="description">
                <div>
                  <div class="btn btn&#45;&#45;lg">
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                      <path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z" fill="currentColor" fill-rule="nonzero"></path>
                    </svg>
                  </div></div>
                <div class="mobile-content">
                  <h4>{{ content.howto.fullscreen }}</h4>
                  <div class="subtitle">{{ content.howto.fullscreenText }}</div>
                </div>
              </div>

              &lt;!&ndash; Shopping List Mobile &ndash;&gt;
&lt;!&ndash;              <div class="description">&ndash;&gt;
&lt;!&ndash;                <div>&ndash;&gt;
&lt;!&ndash;                  <div class="btn btn&#45;&#45;lg">&ndash;&gt;
&lt;!&ndash;                    &lt;!&ndash; <span class="notify-badge">0</span> &ndash;&gt;&ndash;&gt;
&lt;!&ndash;                    <svg width="34px" height="34px" viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">&ndash;&gt;
&lt;!&ndash;                      <g id="-Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">&ndash;&gt;
&lt;!&ndash;                        <g id="SuperC-header-&#45;&#45;English" transform="translate(-1868.000000, -23.000000)">&ndash;&gt;
&lt;!&ndash;                          <g id="icon-&#45;&#45;list" transform="translate(1868.000000, 23.000000)">&ndash;&gt;
&lt;!&ndash;                            <path d="M30,0 C32.209139,0 34,1.790861 34,4 L34,30 C34,32.209139 32.209139,34 30,34 L4,34 C1.790861,34 0,32.209139 0,30 L0,4 C0,1.790861 1.790861,0 4,0 L30,0 Z M30,1 L4,1 C2.40231912,1 1.09633912,2.24891996 1.00509269,3.82372721 L1,4 L1,30 C1,31.5976809 2.24891996,32.9036609 3.82372721,32.9949073 L4,33 L30,33 C31.5976809,33 32.9036609,31.75108 32.9949073,30.1762728 L33,30 L33,4 C33,2.40231912 31.75108,1.09633912 30.1762728,1.00509269 L30,1 Z" id="Rectangle-Copy-14" fill="" fill-rule="nonzero"></path>&ndash;&gt;
&lt;!&ndash;                            <g id="Group" transform="translate(7.000000, 9.000000)" fill="#545454">&ndash;&gt;
&lt;!&ndash;                              <rect id="Rectangle-Copy-34" x="6" y="0" width="14" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                              <rect id="Rectangle-Copy-37" x="0" y="0" width="3" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                              <rect id="Rectangle-Copy-35" x="6" y="7" width="14" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                              <rect id="Rectangle-Copy-38" x="0" y="7" width="3" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                              <rect id="Rectangle-Copy-36" x="6" y="14" width="14" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                              <rect id="Rectangle-Copy-39" x="0" y="14" width="3" height="3" rx="1.5"></rect>&ndash;&gt;
&lt;!&ndash;                            </g>&ndash;&gt;
&lt;!&ndash;                          </g>&ndash;&gt;
&lt;!&ndash;                        </g>&ndash;&gt;
&lt;!&ndash;                      </g>&ndash;&gt;
&lt;!&ndash;                    </svg>&ndash;&gt;
&lt;!&ndash;                  </div></div>&ndash;&gt;
&lt;!&ndash;                <div class="mobile-content">&ndash;&gt;
&lt;!&ndash;                  <h4>{{ content.howto.shoppingList }}</h4>&ndash;&gt;
&lt;!&ndash;                  <div class="subtitle">{{ content.howto.shoppingListText }}</div>&ndash;&gt;
&lt;!&ndash;                </div>&ndash;&gt;
&lt;!&ndash;              </div>&ndash;&gt;

              <div class="description">
                <div><img alt="" src="/images/icon-navigation.svg" /></div>
                <div class="mobile-content">
                  <h4>{{ content.howto.nav }}</h4>
                  <div class="subtitle">{{ content.howto.navMob }}</div>
                </div>
              </div>


              <div class="description">
                <div><img alt="" width="22px" src="/icons/icon-hand-point.svg" /></div>
                <div class="mobile-content">
                  <h4>{{ content.howto.details }}</h4>
                  <div class="subtitle">{{ content.howto.detailsText }}</div>
                </div>
              </div>


            </div>-->
          </div>
        </scroll-container>
        <div class="help-footer desktop">
          <div class="subtitle desktop">{{ content.howto.info }}</div>
          <div class="subtitle mobile">{{ content.howto.info }}</div>
          <button :aria-label="content.howto.tour" class="button walkthrough" @click.stop.prevent="viewTour">{{ content.howto.tour }}</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import {mapActions, mapGetters, mapState} from 'vuex';
//import FeatureHeading from '../../features/help/FeatureHeading.vue';
import ScrollContainer from "@/components/scroll-container/ScrollContainer";
import HelpScreen from "@/features/help/HelpScreen.vue";


export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    HelpScreen,
    ScrollContainer,
    /*FeatureHeading*/
  },
  directives: {
    ClickOutside
  },

  data() {
    return {
      toastContent: null,
      ready: false
    }
  },

  computed: {
    ...mapGetters(['content','language']),
    ...mapGetters('screen', ['flyerOrientation']),
    ...mapState('toast', ['showHelp']),

    columnView(){
      return this.flyerOrientation === 'vertical';
    }
  },

  methods: {
    ...mapActions('toast', ['toggleHelp', 'viewTour']),
    onScrollReady(c){
      c._sz.scale(1);
    },

    closeHelp(){
      if(this.ready){
        this.toggleHelp(false);
        //  console.log('close help');
      }
    }

    // hashCode(s) {
    //   var h = 0, l = s.length, i = 0;
    //   if ( l > 0 )
    //     while (i < l)
    //       h = (h << 5) - h + s.charCodeAt(i++) | 0;
    //   return h;
    // }
  },

  mounted() {
    // this.payload.id = this.hashCode(this.$refs.feature.innerText);
    // this.checkDisplayToast(this.payload.id);
    this.toastContent = this.$refs.toastContent;

  },

  watch:{
    showHelp(v){
      if(v){
        setTimeout(() => {
          this.ready = true;
        }, 1000)
      }
      this.ready = false;

    }
  }

  // }
}
</script>

<style lang="scss" scoped>

.mobile {
  display: none !important;
  flex-flow: column;
  row-gap: 2em;
  padding: 1.5em;
  .description{
    display: flex;
    flex-flow: row;
    text-align: left;
    align-items: center;
    > :first-child{
      width: calc(55px + 1em);
    }
    .mobile-content{
      flex-basis: 100%;
    }
    .pull-button{
      .arrow{
        top:2.5%;
        left:58px;
      }
      .fr{
        left:72px;
      }
    }

  }
}

.modal-wpr {

  --scroll-bar-width: 10px;
  --scroll-bar-thumb-size: 135px;
  --scroll-bar-track-margin: 67.5px;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;



  .modal {
    background-color: #FFF;
    /*margin-top: 75px;*/
    border: 1px solid #BBBBBB;
    border-radius: 4px;
    /* overflow: auto;*/
    max-height: calc(100% - 1em);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
    display:flex;
    flex-flow: column;
    max-width: calc(100% - 4em);

    .header {
      background-color: var(--secondary-color);
      color: var(--primary-text-color);
      display: flex;
      justify-content: space-between;
      padding: 10px;

      h2 {
        font-size: 18px;
        text-transform: uppercase;
        font-weight: 400;
      }

      .close-btn {
        cursor: pointer;
      }
    }

    .subtitle {
      padding-top: 6px;
      font-size: 12px;
    }

    .content {
      display: flex;
      flex-direction: column;
      color: #545454;
      position: relative;
      flex: 1 1 auto;
      overflow: hidden;
      /*.scroll-container{
        position: absolute;
        top:0px;
        bottom:0px;
        left:0px;
        right:0px;
      }*/
      .content-container{
        text-align:center;
        padding: 8px;
      }



      .help-footer{
        text-align: center;
        border-top: 1px solid #545454;
        padding: 6px 0px 15px;
      }

      .f-half {
        display: flex;
        column-gap: 1em;

        flex-direction: column;

        > div {
          flex-basis: 100%;
          display: flex;
          flex-flow: column;
        }
      }

      .content-container{
        width: 700px;
      }

      .feature {
        background: #eee;
        margin: 12px 0;
        display: flex;
        justify-content: center;
        flex: 1;
        //flex-wrap: wrap;
        .description {
          display: flex;
          font-size: 14px;
          padding: 15px 0;
          flex: 1 1 25%;
          .button-preview {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 20px;

            h4 {
              text-transform: uppercase;
              padding-top: 16px;
              white-space: nowrap;
            }

            .subtitle {
              text-align: center;
            }
          }
        }
      }
    }
  }
}

.pull-button{
  padding:4px;
  margin-top:-6px;
  width:35px;
  height:53px;
  background-color: rgba(0,0,0,0.75);
  opacity: 1;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.7);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: 1px solid #FFFFFF;
  border-right: 1px solid #FFFFFF;
  border-bottom: 1px solid #FFFFFF;
  color:#FFFFFF;
}

.pull-button.fr{
  height:55px;
  width:50px;
  margin-top:-5px;
  padding-left:4px;
}
.flyericon-text{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.arrow{
  top:5.5%;
  left:102px;
  display:flex;
  width:4px;
  opacity:0.9;
  cursor: default;
}

.arrow.fr{
  top:4.5%;
  left:124px;
}

.notify-badge{
  position:absolute;
  right:-10px;
  top:-10px;
  background:red;
  display:flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  text-align: center;
  border-radius: 50%;
  color:white;
  font-size:10px;
}

button.button {
  background: #fff;
  border: 1px solid #ccc;
  text-transform: uppercase;
  font-weight: 600;
  color: #666;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 16px;
}

button.button:hover{
  background: #eee;
  color: #000;
}


.btn {
  background: #fff;
  border: 1px solid #BBB;
  border-radius: 4px;
  /*padding: 5px;*/
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  color: #333;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
  cursor: auto;
  pointer-events: none;
  position: relative;
}


.search-toggle {
  display: flex;
  align-items: center;
  width: auto;
  padding: 5px 12px;
  background: var(--button-background);
  color: var(--button-text-color);
  border: var(--button-border);
  font-size: 0.75em;
  box-shadow:  unset;
  cursor: pointer;
  pointer-events: unset;
}

.search-toggle > span {
  margin-right: 8px;
  text-transform: uppercase;
}


.zoom-group {
  display: flex;
  justify-self: end;
  /*margin: 0 2px;*/
  border: 1px solid #BBB;
  border-radius: 4px;
  height: 34px;
  background-color: #FFF;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
}

.zoom-group > * {
  border: 0;
}

.zoom-in {
  font-size: 0px;
  line-height: 0;
}

.zoom-in:disabled {
  cursor: inherit;
}

.zoom-percent {
  font-size: 14px;
  color: #545454;
  display: flex;
  align-items: center;
  padding-bottom: 1px;
}

.zoom-100 {
  font-size: 14px;
  padding: 0 8px;
  border-left: 1px solid #BBB;
  cursor: inherit;
}

.zoom-out {
  font-size: 0px;
  line-height: 0;
}

.zoom-in, .zoom-out{
  padding: 0px;
  width: 30px;
}

.zoom-out img, .zoom-in img{
  vertical-align: middle;
}



.zoom-out:disabled {
  cursor: inherit;
}

.btn.page {
  width: 100%;
  height: 28px;
  justify-content: flex-start;
  padding-left: 3%;
  margin-bottom: 8px;

  & + .subtitle {
    text-align: left !important;
  }
}
.page-num {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  border-radius: 4px;
  font-size: 12px;
  padding: 7px;
}

/*@media only screen and (max-width: 1024px){
  .modal-wpr .modal{
    .content {
      .f-half {
        flex-direction: column !important;
      }
      .content-container{
        width: 925px;
      }
    }
  }
}*/

.navigation{
  .description{
    flex-basis: 50%;
    justify-content: center;
  }
}

@media only screen and (max-height: 850px ) and (min-width: 1024px){
  .modal-wpr .modal{
    .content {
      .f-half {
        flex-direction: row !important;
      }
      .content-container{
        width: 1060px;
        .feature {
          flex-wrap: nowrap;
          .description{
            .pull-button{
              .arrow{
                top:7.5%;
                left:146px;
              }
              .fr{
                left:152px;
              }
            }
          }
        }

        .section-group{
          display: flex;
          div:first-child .feature{
            margin-right: 8px;
          }
          div:last-child .feature{
            margin-left: 8px;
          }
          > div {
            display:flex;
            flex: 1 1 50%;
            flex-direction: column;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 700px) and (min-width: 558px){
  .modal-wpr .modal{
    .content {
      .content-container{
        width: 575px;
      }
    }
  }
}



/* Vertical View Specific */
@media (min-width: 1200px) {



  .modal-wpr .modal.vertical .content .feature.navigation {
    /*.description {
      padding-top: 10px;
      padding-left: 100px;
      padding-bottom: 70px;
      position: relative;
    }*/

    /*.btn.page {
      transform: rotate(90deg);
      width: 146px;
      position: absolute;
      left: 0;
      bottom: 38%;
    }*/


    h4, .subtitle {
      text-align: left;
      width: 100%;
    }
    .subtitle + .subtitle {
      margin-top: 1em;
    }
  }
}

/* Mobile */
@media (max-width: 1200px) {
  // .walkthrough {
  //   display: none;
  // }
}
@media (max-width: 1023px) {
  .walkthrough {
    display: none;
  }
  .mobile {
    display: flex !important;
  }
  .desktop {
    display: none !important;
  }

  .modal-wpr .modal {
    /* margin-top: 140px;
     width: 90% !important;*/

    .content {
      .f-half {
        /*flex-direction: row !important;*/
      }
      .content-container{
        width: 400px;
        min-height:500px;
      }
    }

    .header {
      padding-bottom: 4px;
      h2 {
        font-size: 14px;
      }
    }
  }

  .heading {
    display: none;
  }

  .modal-wpr .modal .content .feature {
    display: block;
    background: none;
    padding: 0 6%;

    .description {
      padding: 0;
      margin-bottom: 20px;
      height: 50px;
    }

    .button-preview {
      display: block;
      position: relative;
      padding-left: 60px;
      width: 100%;

      h4 {
        padding: 0;
      }

      .subtitle {
        text-align: left;
      }

      .btn {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .search-toggle {
    padding: 5px 8px;
  }

  .subtitle.mobile {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
