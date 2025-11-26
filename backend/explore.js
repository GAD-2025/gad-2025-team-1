/* [1] 가상 데이터베이스 (Mock Data - 40개) */
    const artworkData = [
        { id: 1, title: "몽상의 숲", author: "AI Art Lab", tags: ["자연", "풍경화", "트렌디"], category: "이미지 생성", price: "150C", priceValue: 150, date: "2024-11-01", views: 1200, color: "#38761d", liked: false },
        { id: 2, title: "도시적 디자이너", author: "Creative Soul", tags: ["모던", "앱", "미니멀"], category: "어플 디자인", price: "300C", priceValue: 300, date: "2024-10-25", views: 850, color: "#674ea7", liked: false },
        { id: 3, title: "미래 건축", author: "Future Build", tags: ["SF", "건축", "3D"], category: "마케팅 배너", price: "200C", priceValue: 200, date: "2024-11-10", views: 2100, color: "#1c4587", liked: true },
        { id: 4, title: "사용자 경험", author: "UX Master", tags: ["UX", "앱", "기획"], category: "어플 디자인", price: "100C", priceValue: 100, date: "2024-09-15", views: 500, color: "#783f04", liked: false },
        { id: 5, title: "SNS 광고 배너", author: "Marketing Pro", tags: ["광고", "SNS", "트렌디"], category: "마케팅 배너", price: "80C", priceValue: 80, date: "2024-11-20", views: 3000, color: "#cc0000", liked: false },
        { id: 6, title: "도시의 야경", author: "김작가", tags: ["야경", "풍경화", "감성"], category: "일러스트", price: "300C", priceValue: 300, date: "2024-10-05", views: 400, color: "#9a3412", liked: false },
        { id: 7, title: "몽환적인 바다", author: "이작가", tags: ["바다", "몽환", "추상"], category: "일러스트", price: "550C", priceValue: 550, date: "2024-08-30", views: 1500, color: "#9d174d", liked: false },
        { id: 8, title: "사이버펑크 빌딩", author: "박작가", tags: ["SF", "사이버펑크", "컨셉아트"], category: "컨셉아트", price: "720C", priceValue: 720, date: "2024-11-25", views: 200, color: "#1e40af", liked: false },
        { id: 9, title: "미니멀 아이콘", author: "Simplicity", tags: ["미니멀", "아이콘", "UI"], category: "어플 디자인", price: "50C", priceValue: 50, date: "2024-11-15", views: 900, color: "#4b5563", liked: false },
        { id: 10, title: "추상적 감정", author: "Artistic Mind", tags: ["추상", "예술", "감정"], category: "이미지 생성", price: "400C", priceValue: 400, date: "2024-07-20", views: 600, color: "#0f766e", liked: false },
        { id: 11, title: "네온 사인", author: "Night Walker", tags: ["네온", "밤", "힙한"], category: "일러스트", price: "120C", priceValue: 120, date: "2024-11-22", views: 1100, color: "#be185d", liked: false },
        { id: 12, title: "레트로 게임", author: "Pixel Artist", tags: ["레트로", "픽셀", "게임"], category: "컨셉아트", price: "90C", priceValue: 90, date: "2024-10-10", views: 3200, color: "#059669", liked: false },
        { id: 13, title: "화성 거주지", author: "Space X", tags: ["우주", "SF", "배경"], category: "컨셉아트", price: "600C", priceValue: 600, date: "2024-11-18", views: 150, color: "#c2410c", liked: false },
        { id: 14, title: "랜딩 페이지", author: "Web Guru", tags: ["웹", "UI", "비즈니스"], category: "어플 디자인", price: "250C", priceValue: 250, date: "2024-09-01", views: 700, color: "#374151", liked: false },
        { id: 15, title: "가을 풍경", author: "Season Art", tags: ["가을", "자연", "풍경화"], category: "이미지 생성", price: "180C", priceValue: 180, date: "2024-10-15", views: 550, color: "#b45309", liked: false },
        { id: 16, title: "할로윈 파티", author: "Event Master", tags: ["할로윈", "이벤트", "배너"], category: "마케팅 배너", price: "50C", priceValue: 50, date: "2024-10-30", views: 4000, color: "#7c2d12", liked: false },
        { id: 17, title: "겨울 왕국", author: "Snow Man", tags: ["겨울", "눈", "판타지"], category: "일러스트", price: "330C", priceValue: 330, date: "2024-11-28", views: 2200, color: "#0ea5e9", liked: false },
        { id: 18, title: "AI 로봇", author: "Tech Lab", tags: ["로봇", "AI", "미래"], category: "이미지 생성", price: "450C", priceValue: 450, date: "2024-08-05", views: 900, color: "#475569", liked: false },
        { id: 19, title: "모바일 뱅킹", author: "FinTech", tags: ["금융", "앱", "UI"], category: "어플 디자인", price: "500C", priceValue: 500, date: "2024-11-05", views: 300, color: "#1e3a8a", liked: false },
        { id: 20, title: "블랙 프라이데이", author: "Sale King", tags: ["세일", "광고", "배너"], category: "마케팅 배너", price: "40C", priceValue: 40, date: "2024-11-25", views: 5000, color: "#000000", liked: false },
        { id: 21, title: "숲속의 오두막", author: "Nature Lover", tags: ["힐링", "숲", "동화"], category: "일러스트", price: "220C", priceValue: 220, date: "2024-09-20", views: 1300, color: "#166534", liked: false },
        { id: 22, title: "고양이 초상화", author: "Cat Mom", tags: ["동물", "고양이", "귀여운"], category: "이미지 생성", price: "110C", priceValue: 110, date: "2024-11-12", views: 2500, color: "#f59e0b", liked: false },
        { id: 23, title: "대시보드 UI", author: "Admin Pro", tags: ["관리자", "웹", "데이터"], category: "어플 디자인", price: "350C", priceValue: 350, date: "2024-10-01", views: 600, color: "#312e81", liked: false },
        { id: 24, title: "신년 인사", author: "Card Maker", tags: ["새해", "카드", "전통"], category: "마케팅 배너", price: "60C", priceValue: 60, date: "2024-12-01", views: 800, color: "#9f1239", liked: false },
        { id: 25, title: "수중 도시", author: "Deep Sea", tags: ["물", "SF", "판타지"], category: "컨셉아트", price: "650C", priceValue: 650, date: "2024-07-15", views: 180, color: "#0891b2", liked: false },
        { id: 26, title: "빈티지 카페", author: "Coffee Love", tags: ["카페", "빈티지", "감성"], category: "일러스트", price: "190C", priceValue: 190, date: "2024-10-22", views: 1400, color: "#78350f", liked: false },
        { id: 27, title: "운동 앱 UI", author: "Health Care", tags: ["운동", "건강", "앱"], category: "어플 디자인", price: "280C", priceValue: 280, date: "2024-11-08", views: 950, color: "#15803d", liked: false },
        { id: 28, title: "봄의 정원", author: "Flower Art", tags: ["봄", "꽃", "화사한"], category: "이미지 생성", price: "160C", priceValue: 160, date: "2024-04-10", views: 2000, color: "#db2777", liked: false },
        { id: 29, title: "판타지 드래곤", author: "Dragon Lord", tags: ["판타지", "몬스터", "용"], category: "컨셉아트", price: "800C", priceValue: 800, date: "2024-11-29", views: 50, color: "#4c1d95", liked: false },
        { id: 30, title: "유튜브 인트로", author: "Video Star", tags: ["유튜브", "영상", "썸네일"], category: "마케팅 배너", price: "70C", priceValue: 70, date: "2024-11-15", views: 3500, color: "#b91c1c", liked: false },
    ];

    // [전역 상태 변수]
    let currentKeyword = "";
    let showLikedOnly = false;
    let currentPage = 1;
    const itemsPerPage = 8;
    let currentFilteredData = [];
    
    // 장바구니 및 모달 상태
    let cart = []; 
    let currentOpenedItemId = null; 
    
    // 최근 검색어 상태
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // [NEW] 필터 적용 타임아웃 변수 (빠른 클릭 시 중복 실행 방지)
    let filterTimeout = null;

    /* 검색 실행 함수 */
    function executeSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (!query) {
            alert("검색어를 입력해주세요.");
            return;
        }

        saveRecentSearch(query);
        
        currentKeyword = query.toLowerCase();
        
        const defaultContent = document.getElementById('defaultContent');
        const searchResultsSection = document.getElementById('searchResultsSection');
        if (defaultContent) defaultContent.classList.add('hidden');
        if (searchResultsSection) searchResultsSection.classList.remove('hidden');
        
        const querySpan = document.getElementById('currentQuery');
        if (querySpan) querySpan.textContent = query;

        resetFilterValues();
        applyFilters();

        document.getElementById('recentSearchDropdown').classList.add('hidden');
    }

    /* 최근 검색어 저장 */
    function saveRecentSearch(keyword) {
        recentSearches = recentSearches.filter(item => item !== keyword);
        recentSearches.unshift(keyword);
        if (recentSearches.length > 3) recentSearches.pop();
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    /* 최근 검색어 표시 */
    function showRecentSearches() {
        const dropdown = document.getElementById('recentSearchDropdown');
        const list = document.getElementById('recentSearchList');
        
        if (recentSearches.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }

        list.innerHTML = recentSearches.map(keyword => `
            <li class="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 text-gray-300 hover:text-white transition flex justify-between items-center group"
                onclick="searchKeyword('${keyword}')">
                <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-gray-500 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>${keyword}</span>
                </div>
                <span class="text-xs text-gray-600 group-hover:text-gray-400">검색</span>
            </li>
        `).join('');

        dropdown.classList.remove('hidden');
    }

    function hideRecentSearchesWithDelay() {
        setTimeout(() => {
            document.getElementById('recentSearchDropdown').classList.add('hidden');
        }, 200);
    }

    function clearRecentSearches() {
        recentSearches = [];
        localStorage.removeItem('recentSearches');
        document.getElementById('recentSearchDropdown').classList.add('hidden');
    }

    /* 태그 클릭 검색 */
    function searchKeyword(keyword) {
        const searchInput = document.getElementById('searchInput');
        const cleanKeyword = keyword.replace('#', '');
        if (searchInput) {
            searchInput.value = cleanKeyword;
            executeSearch();
        }
    }

    /* [NEW] 통합 필터링 로직 (스켈레톤 로딩 추가) */
    function applyFilters() {
        // 기존 진행 중인 타이머가 있다면 취소 (빠른 클릭 대응)
        if (filterTimeout) clearTimeout(filterTimeout);

        // 1. 먼저 스켈레톤 UI를 보여줍니다.
        renderSkeleton();

        // 2. 0.5초 뒤에 실제 데이터를 필터링하고 그립니다.
        filterTimeout = setTimeout(() => {
            performFiltering();
        }, 500);
    }

    /* [NEW] 실제 데이터 필터링 및 렌더링 함수 (기존 applyFilters 로직 이동) */
    function performFiltering() {
        currentPage = 1;
        const categoryFilter = document.getElementById('filterCategory')?.value || 'all';
        const priceFilter = document.getElementById('filterPrice')?.value || 'all';
        const sortOrder = document.getElementById('sortOrder')?.value || 'relevance';

        let filtered = artworkData.filter(item => {
            const matchQuery = item.title.toLowerCase().includes(currentKeyword) || 
                               item.author.toLowerCase().includes(currentKeyword) ||
                               item.tags.some(tag => tag.toLowerCase().includes(currentKeyword));
            const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
            
            let matchPrice = true;
            if (priceFilter === 'free') matchPrice = item.priceValue === 0;
            else if (priceFilter === 'low') matchPrice = item.priceValue > 0 && item.priceValue <= 100;
            else if (priceFilter === 'mid') matchPrice = item.priceValue > 100 && item.priceValue <= 300;
            else if (priceFilter === 'high') matchPrice = item.priceValue > 300;
            
            const matchLiked = showLikedOnly ? item.liked : true;

            return matchQuery && matchCategory && matchPrice && matchLiked;
        });

        if (sortOrder === 'latest') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOrder === 'popular') {
            filtered.sort((a, b) => b.views - a.views);
        } else if (sortOrder === 'price_asc') {
            filtered.sort((a, b) => a.priceValue - b.priceValue);
        }

        currentFilteredData = filtered;
        renderResults(); // 실제 데이터 그리기
        updateLikedButtonUI();
    }

    /* [NEW] 스켈레톤 UI 그리기 함수 */
    function renderSkeleton() {
        const resultsGrid = document.getElementById('resultsGrid');
        const resultCount = document.getElementById('resultCount');
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        const noResultsMsg = document.getElementById('noResultsMsg');

        // 로딩 중에는 카운트와 더보기 버튼 등을 숨기거나 '로딩중...' 표시
        if(resultCount) resultCount.innerText = "(로딩중...)";
        if(loadMoreContainer) loadMoreContainer.classList.add('hidden');
        if(noResultsMsg) noResultsMsg.classList.add('hidden');

        // 스켈레톤 카드 8개 생성
        let skeletonHTML = '';
        for (let i = 0; i < 8; i++) {
            skeletonHTML += `
                <div class="rounded-xl overflow-hidden bg-gray-800 border border-gray-700 animate-pulse">
                    <div class="h-48 bg-gray-700/50"></div> <div class="p-6 space-y-3">
                        <div class="h-6 bg-gray-700/50 rounded w-3/4"></div> <div class="h-4 bg-gray-700/50 rounded w-1/2"></div> </div>
                    <div class="p-4 border-t border-gray-700 flex justify-between items-center">
                        <div class="flex space-x-2">
                            <div class="h-4 w-10 bg-gray-700/50 rounded"></div>
                            <div class="h-4 w-10 bg-gray-700/50 rounded"></div>
                        </div>
                        <div class="h-5 w-12 bg-gray-700/50 rounded"></div> </div>
                </div>
            `;
        }
        resultsGrid.innerHTML = skeletonHTML;
    }


    /* 화면 렌더링 (페이지네이션) */
    function renderResults() {
        const resultsGrid = document.getElementById('resultsGrid');
        const noResultsMsg = document.getElementById('noResultsMsg');
        const resultCount = document.getElementById('resultCount');
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        const displayedCountSpan = document.getElementById('displayedCount');
        const totalCountSpan = document.getElementById('totalCount');

        if (!resultsGrid) return;

        if (resultCount) resultCount.textContent = `(${currentFilteredData.length}건)`;
        
        if (currentFilteredData.length === 0) {
            resultsGrid.innerHTML = '';
            if (noResultsMsg) noResultsMsg.classList.remove('hidden');
            if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
            return;
        }

        if (noResultsMsg) noResultsMsg.classList.add('hidden');

        const itemsToShow = currentFilteredData.slice(0, currentPage * itemsPerPage);
        
        resultsGrid.innerHTML = itemsToShow.map(item => createCardHTML(item)).join('');

        if (itemsToShow.length < currentFilteredData.length) {
            loadMoreContainer.classList.remove('hidden');
            displayedCountSpan.textContent = itemsToShow.length;
            totalCountSpan.textContent = currentFilteredData.length;
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }

    function loadMoreItems() {
        // 더보기는 스켈레톤 없이 바로 로드 (UX 선택 사항)
        currentPage++;
        renderResults();
    }

    /* 카드 생성 헬퍼 */
    function createCardHTML(item) {
        const bgStyle = item.color ? `background-color: ${item.color};` : '';
        const heartClass = item.liked ? "text-red-500 fill-current" : "text-white hover:text-red-400";
        const isNewItem = isNew(item.date);

        return `
            <div class="group relative rounded-xl overflow-hidden cursor-pointer transition duration-300 hover:shadow-2xl bg-gray-800 border border-gray-700 hover:border-gray-500 fade-in">
                <div class="h-48 relative p-6 flex flex-col justify-between" style="${bgStyle}" onclick="openModalDetails(${item.id})">
                    <div class="flex justify-between items-start z-10">
                        <span class="text-xs bg-black/40 text-white px-2 py-1 rounded backdrop-blur-sm border border-white/10">${item.category}</span>
                        ${isNewItem ? '<span class="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full shadow-lg">NEW</span>' : ''}
                    </div>
                    <div class="z-10">
                        <h3 class="text-xl font-bold text-white drop-shadow-md group-hover:scale-105 transition-transform origin-left">${item.title}</h3>
                        <p class="text-xs text-white/90 font-light">${item.author}</p>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>
                
                <button onclick="toggleLike(event, ${item.id})" class="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/20 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ${heartClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                <div class="p-4 bg-gray-900 border-t border-gray-700 flex justify-between items-center" onclick="openModalDetails(${item.id})">
                    <div class="flex space-x-1 overflow-hidden">
                        ${item.tags.slice(0, 2).map(tag => `<span class="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">#${tag}</span>`).join('')}
                    </div>
                    <span class="text-orange-400 font-bold text-lg">${item.price}</span>
                </div>
            </div>
        `;
    }

    /* 찜하기 토글 */
    function toggleLike(event, id) {
        event.stopPropagation();
        const item = artworkData.find(d => d.id === id);
        if (item) {
            item.liked = !item.liked;
            if (item.liked) showToast(`'${item.title}' 찜 완료! ❤️`);
            else showToast(`찜 삭제 완료.`);
            // 찜하기는 스켈레톤 없이 즉시 반영 (UX 향상)
            // performFiltering만 호출하면 스켈레톤 없이 렌더링 가능
            performFiltering();
        }
    }

    function toggleLikedFilter() {
        showLikedOnly = !showLikedOnly;
        applyFilters(); // 필터 변경 시에는 스켈레톤 보여줌
    }

    function updateLikedButtonUI() {
        const btn = document.getElementById('btnToggleLike');
        if (btn) {
            if (showLikedOnly) {
                btn.classList.add('bg-red-900/30', 'border-red-500', 'text-white');
                btn.classList.remove('bg-gray-900', 'border-gray-600', 'text-gray-400');
            } else {
                btn.classList.remove('bg-red-900/30', 'border-red-500', 'text-white');
                btn.classList.add('bg-gray-900', 'border-gray-600', 'text-gray-400');
            }
        }
    }

    /* 장바구니 기능 */
    function addToCartCurrentItem() {
        if (!currentOpenedItemId) return;
        if (cart.includes(currentOpenedItemId)) {
            showToast("이미 장바구니에 담긴 작품입니다.");
            return;
        }
        cart.push(currentOpenedItemId);
        updateCartCount();
        const item = artworkData.find(d => d.id === currentOpenedItemId);
        if(item) showToast(`🛒 '${item.title}' 장바구니에 담김!`);
    }

    function updateCartCount() {
        const badge = document.getElementById('cartCountBadge');
        if (badge) {
            badge.innerText = cart.length;
            if (cart.length > 0) badge.classList.remove('hidden');
            else badge.classList.add('hidden');
        }
    }

    /* 모달 기능 */
    function openModalDetails(id) {
        const item = artworkData.find(d => d.id === id);
        if (!item) return;

        currentOpenedItemId = item.id;

        const modal = document.getElementById('artworkDetailModal');
        if (modal) {
            document.getElementById('modalArtworkTitle').textContent = item.title;
            document.getElementById('modalAuthor').textContent = item.author;
            document.getElementById('modalCategory').textContent = item.category;
            document.getElementById('modalPrice').textContent = item.price;
            
            const imgArea = document.getElementById('modalImageArea');
            if(imgArea) imgArea.style.backgroundColor = item.color;

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        const modal = document.getElementById('artworkDetailModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            currentOpenedItemId = null;
        }
    }

    /* 유틸리티 */
    function showToast(message) {
        const toast = document.getElementById('toastMessage');
        const toastText = document.getElementById('toastText');
        if (toast && toastText) {
            toastText.textContent = message;
            toast.classList.remove('opacity-0', 'translate-y-10');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-10');
            }, 3000);
        }
    }

    function resetFilterValues() {
        const catFilter = document.getElementById('filterCategory');
        const priceFilter = document.getElementById('filterPrice');
        const sortFilter = document.getElementById('sortOrder');
        if (catFilter) catFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'relevance';
        showLikedOnly = false;
    }

    function resetFilters() {
        resetFilterValues();
        applyFilters();
    }

    function resetSearch(e) {
        if(e) e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        document.getElementById('defaultContent').classList.remove('hidden');
        document.getElementById('searchResultsSection').classList.add('hidden');
    }

    function isNew(dateString) {
        const date = new Date(dateString);
        const now = new Date('2024-11-26');
        const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24)); 
        return diffDays <= 30; 
    }

    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('artworkDetailModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'artworkDetailModal') closeModal();
            });
        }
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') executeSearch();
            });
        }
    });