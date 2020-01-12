var SITE_CONFIG = {
    general: {
        responsive: '(max-width: 1024px)', /* kaç px de responsive geçeceği */
        regex: {
            typ1: /[^a-zA-ZıiIğüşöçİĞÜŞÖÇ\s]+/, /* sadece harf */
            typ2: /[^0-9\s]+/, /* sadece rakam */
            typ3: /[^a-zA-ZıiI0-9ğüşöçİĞÜŞÖÇ\s]+/ /* harf rakam karışık */
        },
    },
    management: {

        /* 
            url selection 
        */
        urlSelected: [

        ],
        
        /* 
            form yönetimi 
        */
        form: [
            
            
        ],

        /* 
            append yönetimi 
        */
        append: [
           
        ]
    },
    plugin: {

        animate: {
            animCls: 'slideInUp', // viewporta girince alacağı class belirlenir.
            threshold: 0, // threshold değeri
            delay: 0, // girilen milisaniyeye göre settimeot ile classı atacak
        },

        /* 
            zoom gallery
        */
        zoomGallery: {
            ID: '.product-details .prdd-gallery',
            'prop': {
                'template': {
                    'wrp': '<div class="zoom-gallery"><div class="zoom-gallery-inner"><a href="javascript:void(0);" class="modal-close close-btn sub-close">{{closeButton}}</a><div class="modal-header zoom-gallery-header d-lg-none"><span class="text-truncate">{{title}}</span></div>{{large}}{{thumbs}}<div class="zoom-gallery-footer">'+ ($('[data-target="[rel=\'lbfZoomFooter\']"]').html() || 'büyütmek için çift tıkla') +'</div></div></div>',
                    'large': '<div class="large-wrapper swiper-container"><div class="swiper-inner"><ul class="swiper-wrapper">{{li}}</ul></div><div class="swiper-button-prev zoom-swiper-large-button-prev">{{largeButtonPrev}}</div><div class="swiper-button-next zoom-swiper-large-button-next">{{largeButtonNext}}</div><div class="swiper-pagination"></div></div>',
                    'largeLi': '<li data-order="{{order}}" class="swiper-slide"><div class="swiper-zoom-container"><img data-src="{{src}}" class="zoom-img swiper-lazy"></div><div class="swiper-lazy-preloader"></div></li>',
                    'thumbs': '<div class="thumbs-wrapper swiper-container"><div class="swiper-inner"><ul class="swiper-wrapper">{{li}}</ul></div><div class="swiper-button-prev zoom-swiper-thumb-button-prev">{{thumbButtonPrev}}</div><div class="swiper-button-next zoom-swiper-thumb-button-next">{{thumbButtonNext}}</div></div>',
                    'thumbsLi': '<li data-order="{{order}}" class="swiper-slide"><span><img src="{{src}}" border="0" /></span></li>'
                },
                thumbConfig: {
                    slideToClickedSlide: true,
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                    onlyExternal: true,
                    spaceBetween: 10,
                    direction:  'vertical',
                    navigation: {
                        nextEl: '.zoom-swiper-thumb-button-next',
                        prevEl: '.zoom-swiper-thumb-button-prev',
                    },
                },
                thumbConfigMobi: {
                    slideToClickedSlide: true,
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    onlyExternal: true,
                    spaceBetween: 10,
                    direction:  'horizontal',
                    navigation: {
                        nextEl: '.zoom-swiper-thumb-button-next',
                        prevEl: '.zoom-swiper-thumb-button-prev',
                    }
                },
                closeButton: '<svg class="icon-close"><use xlink:href="#icon-close"></use></svg>',
                title: $('.prdd-title').eq(0).text() || ''
            }
        },

        /* 
           social Share
       */
        socialShare: {
            ID: '.social-share-body > a'
        },

        /* 
            load more button
        */
        loadMoreButton: {
            'ID': '.loadmore-btn-list',
            'prop': {
                'activePaging': '.urunPaging_pageNavigation [id$="ascPagingDataAlt_lblPaging"] span',
                'target': '.urnList .emosInfinite',
                'paging': '.urunPaging_pageNavigation'
            }
        },

        /* 
            counter
        */
        counter: {
            'ID': '.ems-grid-table-favorite [id$="txtURN_ADET"]',
        },

        /* 
           kategori filter
       */
        categoryFilter: {
            'ID': '.ems-page-product-list',
            'prop': {
                'target': '.ems-page-product-list', // ajx ile htmlin dolacağı kapsayici div
                'btn': '.urunKiyaslamaOzellik_ozellik a, .menuKategori li:not(".no-ajx") > a, .urunPaging_pageNavigation a, .ozellikSecimGrup a, .urunKiyaslamaOzellik_tumunuTemizle a', // ajx button olacak tüm nesneler buraya tanımlanır

                'mobiBtn': '.btn-filter-popup', // mobilde filtre popup açma
                'mobiCloseBtn': '.kutuDefault.kutuOzellikFiltre .btn-close, #pnlSecimiDarat .kutuFooterOzellikFiltre .filter-apply', // mobilde filtre popup açma
            }
        },

        /*  
            list sort
        */
        listSort: [
            {
                'ID': '.ems-sort-body .sorts',
                'prop': {
                    'btn': '[rel]',
                    'mobiBtn': '.btn-sort-popup',
                    'mobiCloseBtn': '.ems-sort .btn-close, .sort-apply .btn',
                    'clearBtn': '.sort-clear > a'
                }
            }
        ],

        /* 
           liste görünüm
       */
        viewer: {
            'ID': '.views',
            'prop': {
                'btn': '[rel]',
                'selected': 'active',
                'defaultSelected': {
                    'mobi': 'view-2',
                    'desktop': 'view-3'
                }
            }
        },

        /* 
            kategori swiper
        */
        catSwiper: [
            {
                'ID': '.menuKategori',
                'prop': {
                    'target': '.categories-append',
                    'addAllBtn': '[data-target="[rel=\'lbfTumu\']"]'
                }
            }
        ],

        /* 
         popular worlds
        */
        popularWorlds: [
            {
                'ID': '.popular-search-words',
                'prop': {
                    'input': '[id="txtARM_KEYWORD"]',
                    'btn': '[data-keyword]'
                }
            }
        ],

        /* 
            custom search
        */
        customSearch: {
            'ID': '.mini-search',
            'prop': {
                btn: '.open-search', // trigger button
                clearButton: '.mini-search .clear-button', // input içerisini temizleme
                closeBtn: '.mini-search-overlay, .trigger-search-close', // search close button
                input: '.search-keyword', // search input

                // cls
                ajx: 'mini-search-ajx-loading',
                ready: 'mini-search-ready',
                animate: 'mini-search-animate',
                focused: 'mini-search-focused',
                keyup: 'mini-search-keyup',
                result: 'mini-search-result-found',
                noResult: 'mini-search-no-result',
            }
        },

        /* 
            dropDown
        */
        dropDown: [
            {
                'ID': '.mini-cart',
                'prop': {
                    'clicked': '.open-cart',
                    'closeElem': '.mini-member',
                    'type': isMobile ? 'click' : 'click',
                    'customClass': 'ems-cart-opened',
                    'bdyCls': 'mini-cart-ready',
                    'bdyCls2': 'mini-cart-animate',
                    'closedBtn': '.mini-cart-overlay',
                    'overlay': true,
                    'openedDelay': 222
                }
            },
            {
                'ID': '.mini-member',
                'prop': {
                    'clicked': '.open-member',
                    'closeElem': '.mini-cart',
                    'type': isMobile ? 'click' : 'click',
                    'customClass': 'user-opened',
                    'bdyCls': 'mini-member-ready',
                    'bdyCls2': 'mini-member-animate',
                    'closedBtn': '.mini-member-overlay',
                    'overlay': true,
                    'openedDelay': 222
                }
            },
        ],

        /* 
            main menu
        */
        menu: [

            {
                'ID': '#lvl1Grp',
                /*
                    NOT: cosmetica daki gibi bir menu istenirse
                    'custom': {
                        'elm': '.sub-nav > ul',
                        'unbind': '.sub-nav > ul > li',
                        'target': '> li:eq( 1 )',
                        'class': 'selected'
                    },
                */
                'prop': {
                    'closeElem': '.mod-mini-cart, .mod-mini-login',
                    'bdyClicked': true,
                    'eventType': isMobile ? 'click' : 'hover',
                    'overlay': true,
                    'bdyCls': 'header-menu-ready',
                    'bdyCls2': 'header-menu-animate',
                    'items': '> ul > li'
                }
            }
        ],

        /* 
            swiper config
        */
        swiper: {

            defaultOpt: {
                videoStretching: 'responsive'
            },

            main: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            productListMultipleImage: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                effect: isMobile ? 'slide' : 'fade',
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            },

            dailyOpportunity: {
                preloadImages: false,
                lazyLoading: true,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            },

            discoverProducts: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 4.5,
                spaceBetween: 15,
                slidesOffsetBefore: 15,
                slidesOffsetAfter: 15,
            },

            galleryThumbs: {
                spaceBetween: 40,
                slidesPerView: 11,
                freeMode: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                centerInsufficientSlides: true
            },

            detailGalleryThumbs: {
                spaceBetween: 18,
                slidesPerView: 5,
                freeMode: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                centerInsufficientSlides: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            primaryCategories: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    1024: {
                      slidesPerView: 1.15,
                      spaceBetween: 15,
                      slidesOffsetBefore: 15,
                      slidesOffsetAfter: 15,
                    },
                }
            },

            opportunityProducts: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 4,
                slidesPerColumn: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                        slidesPerColumn: 2,
                    },
                }
            },

            campaigns: {
                init: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 2,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints:{
                    1024:{
                        slidesPerView: 1,
                    }
                }
            },

            primaryProducts: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 2.8,
                spaceBetween: 15,
                slidesOffsetBefore: 15,
                slidesOffsetAfter: 15,
            },

            recommendedProducts: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 6,
                slidesPerGroup: 6,
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 2.8,
                        slidesPerGroup: 1,
                        spaceBetween: 15,
                        slidesOffsetBefore: 15,
                        slidesOffsetAfter: 15,
                    },
                }
            },

            recentlyVisited: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 6,
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            },
            
            categories: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 'auto',
                spaceBetween: 10,
                slidesOffsetBefore: 15,
                slidesOffsetAfter: 15,
            },

            CartBannerItems: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 3,
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints:{
                    1024:{
                        slidesPerView: 1.13,
                        spaceBetween: 10,
                        slidesOffsetBefore: 15,
                        slidesOffsetAfter: 15,
                    }
                }
            },

            CategoriesPage: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 6,
                spaceBetween: 20,
                slidesPerGroup: 6,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints:{
                    1024:{
                        slidesPerView: 3,
                    }
                }
            },

            subCategories: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 6,
                spaceBetween: 20,
                slidesPerGroup: 6,
                centerInsufficientSlides: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            gallery: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints:{
                    1024:{
                        slidesPerView: 1.55,
                        spaceBetween: 2,
                    }
                }
            },

            landingSwiper: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1.3,
                spaceBetween: 15,
                slidesOffsetBefore: 20,
                slidesOffsetAfter: 20
            },

            landingProductList: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 4.5,
                slidesPerGroup: 4,
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 2.8,
                        slidesPerGroup: 1,
                        spaceBetween: 15,
                        slidesOffsetBefore: 15,
                        slidesOffsetAfter: 15,
                    },
                }
            },

            landingcampaigns: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                }
            },

            landingCategoriesList: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 6,
                slidesPerColumn: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                        slidesPerColumn: 2,
                    },
                }
            },

            trendCategories: {
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1.8,
                spaceBetween: 15,
                slidesOffsetBefore: 20,
                slidesOffsetAfter: 20
            },

            widgetFive: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 5,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            widgetThree: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 3,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            widgetVertical: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                loop: true,
                direction: 'vertical'
            },

            widgetAuto: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 'auto',
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            }
        },

        /* input, selectbox, radiobox stillendirme */
        styler: [
            //passiveIco: ikon
            //activeIco: tıklandıktan sonraki ikon
            //class: özel class
            {
                ID: 'select',
                prop: {
                    wrapper: true,
                    passiveIco: '<svg class="icon icon-select"><use xlink:href="#icon-select"></use></svg>',
                    activeIco: '<svg class="icon icon-select-active"><use xlink:href="#icon-select-active"></use></svg>',
                    customClass: ''
                }
            },
            {
                ID: 'input:checkbox',
                prop: {
                    wrapper: true,
                    passiveIco: '<svg class="icon icon-checkbox"><use xlink:href="#icon-checkbox"></use></svg>',
                    activeIco: '<svg class="icon icon-checkbox-active"><use xlink:href="#icon-checkbox-active"></use></svg>',
                    customClass: ''
                }
            },
            {
                ID: 'input:radio',
                prop: {
                    wrapper: true,
                    passiveIco: '<svg class="icon icon-radio"><use xlink:href="#icon-radio"></use></svg>',
                    activeIco: '<svg class="icon icon-radio-active"><use xlink:href="#icon-radio-active"></use></svg>',
                    customClass: 'ems-custom-radiobox'
                }
            }
        ]
    }
};