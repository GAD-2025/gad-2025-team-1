
/**
 * =========================================================
 * 공유 로직: 모달 제어
 * =========================================================
 */

/**
 * 작품 상세 페이지 모달을 띄우는 함수입니다.
 * 실제 프로토타입 뎁스를 시뮬레이션하며, 모든 페이지에서 사용됩니다.
 * @param {string} artworkName 클릭된 작품/작가 이름 또는 검색어
 */
function openModal(artworkName) {
    const modal = document.getElementById('artworkDetailModal');
    const modalTitle = modal.querySelector('h2');
    
    // 모달 내용 업데이트 (페이지에 따라 제목 변경)
    if (artworkName) {
        if (artworkName.startsWith('#') || artworkName.includes('검색 결과')) {
             modalTitle.textContent = `${artworkName} (작품 나열 시뮬레이션)`;
        } else {
             modalTitle.textContent = `${artworkName} 작품 상세 페이지 (프로토타입)`;
        }
    } else {
        modalTitle.textContent = '작품 상세 페이지 (프로토타입)';
    }
    
    modal.style.display = 'flex'; // 모달 표시
    document.body.style.overflow = 'hidden'; // 스크롤 잠금
}

/**
 * 작품 상세 페이지 모달을 닫는 함수입니다.
 */
function closeModal() {
    document.getElementById('artworkDetailModal').style.display = 'none'; // 모달 숨김
    document.body.style.overflow = ''; // 스크롤 잠금 해제
}

// 모달 외부 클릭 시 닫기
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('artworkDetailModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'artworkDetailModal') {
                closeModal();
            }
        });
    }
    // 페이지별 초기화 로직 실행
    if (document.title.includes('거래하기')) {
        initTradePage();
    }
});


/**
 * =========================================================
 * 탐색 페이지 로직 (index.html에서 사용)
 * =========================================================
 */

/**
 * 탐색 페이지의 검색 버튼 클릭 시 동작하는 함수입니다.
 */
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    const keywords = ['트렌디', '미니멀', '추상', '풍경화', '컨셉아트'];

    if (query !== '') {
        if (keywords.includes(query)) {
            openModal(`키워드 검색 결과: ${query}`);
        } else {
            openModal(`'${query}'에 대한 검색 결과 (작품 나열 시뮬레이션)`);
        }
        if (searchInput) searchInput.value = '';
    }
}


/**
 * =========================================================
 * 거래하기 페이지 로직 (trade_search.html에서 사용)
 * =========================================================
 */

// 작품 데이터 정의 (로컬 경로와 제목 매핑)
const ARTWORK_DATA = [
    { id: 1, title: "우주의 연결", artist: "테드 오닐", price: 300, popular: 850, imagePath: '이미지_모음/art_6.jpg' },
    { id: 2, title: "우주의 선물", artist: "엘라 포터", price: 550, popular: 720, imagePath: '이미지_모음/art_7.jpg' },
    { id: 3, title: "핑크 스타 스트림", artist: "아이리스 정", price: 720, popular: 910, imagePath: '이미지_모음/folder_1.jpg' },
    { id: 4, title: "달의 초상", artist: "션 리", price: 450, popular: 600, imagePath: '이미지_모음/folder_2.jpg' },
    { id: 5, title: "핑크 칙 픽셀", artist: "제이슨 킴", price: 680, popular: 880, imagePath: '이미지_모음/friend_1.jpg' },
    { id: 6, title: "헤드폰 고양이", artist: "루나 박", price: 320, popular: 450, imagePath: '이미지_모음/friend_2.jpg' },
    { id: 7, title: "픽셀 천사 햄스터", artist: "마일즈 최", price: 500, popular: 650, imagePath: '이미지_모음/friend_3.jpg' },
    { id: 8, title: "식빵 고양이", artist: "비비안 강", price: 780, popular: 950, imagePath: '이미지_모음/friend_4.jpg' },
    { id: 9, title: "붉은 리본 고양이", artist: "아멜리아 한", price: 890, popular: 1020, imagePath: '이미지_모음/White Cats.jpg' },
    { id: 10, title: "Puffed S", artist: "라이언 서", price: 620, popular: 780, imagePath: '이미지_모음/wish_1.jpg' },
    { id: 11, title: "사이버 도시의 새벽", artist: "그레이스 유", price: 490, popular: 610, imagePath: '이미지_모음/art_6.jpg' },
    { id: 12, title: "은하수 판타지", artist: "데릭 진", price: 410, popular: 530, imagePath: '이미지_모음/art_7.jpg' },
    // 작품 목록을 더 채우기 위해 이미지 반복
    { id: 13, title: "크리스탈 성운", artist: "크리스 임", price: 580, popular: 770, imagePath: '이미지_모음/folder_1.jpg' },
    { id: 14, title: "미래의 발자취", artist: "줄리 홍", price: 650, popular: 810, imagePath: '이미지_모음/folder_2.jpg' },
    { id: 15, title: "꿈꾸는 곰돌이", artist: "배작가", price: 920, popular: 1100, imagePath: '이미지_모음/friend_1.jpg' },
    { id: 16, title: "하늘을 나는 배", artist: "서작가", price: 490, popular: 610, imagePath: '이미지_모음/friend_2.jpg' },
    { id: 17, title: "황금빛 미로", artist: "유작가", price: 410, popular: 530, imagePath: '이미지_모음/friend_3.jpg' },
    { id: 18, title: "별빛의 속삭임", artist: "진작가", price: 580, popular: 770, imagePath: '이미지_모음/friend_4.jpg' },
    { id: 19, title: "우주 대폭발", artist: "임작가", price: 650, popular: 810, imagePath: '이미지_모음/White Cats.jpg' },
    { id: 20, title: "무지개 행성", artist: "홍작가", price: 920, popular: 1100, imagePath: '이미지_모음/wish_1.jpg' },
];

const artworksPerPage = 12; // 페이지당 작품 수
let currentTradePage = 1;
let currentTradeData = ARTWORK_DATA;

/**
 * 거래하기 페이지의 검색 버튼 클릭 시 동작하는 함수입니다.
 */
function handleSearchTrade() {
    const searchInput = document.getElementById('tradeSearchInput');
    const query = searchInput ? searchInput.value.trim() : '';

    if (query) {
        // 검색 결과를 시뮬레이션하고 모달을 띄웁니다.
        openModal(`'${query}'에 대한 거래 작품 검색 결과`);
    } else {
        alert('검색어를 입력해주세요.');
    }
    if (searchInput) searchInput.value = '';
}

/**
 * 작품 카드를 생성하는 HTML 문자열을 반환합니다.
 */
function createArtworkCard(artwork) {
    const artistName = artwork.artist;
    const artworkTitle = artwork.title;
    // 로컬 경로를 사용하도록 수정
    const imageSource = artwork.imagePath || `https://placehold.co/400x400/${artwork.color || '3f3f46'}/ffffff?text=Art+${artwork.id}`;

    return `
        <div class="rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition duration-300" onclick="openModal('${artworkTitle} - ${artistName}')">
            <!-- 썸네일 -->
            <div class="aspect-square relative flex items-center justify-center bg-gray-600/50 artwork-thumbnail">
                <!-- 로컬 이미지가 로드 안될 경우 대비하여 Placeholder URL을 Fallback으로 사용 -->
                <img src="${imageSource}" alt="${artworkTitle} 썸네일" 
                     class="w-full h-full object-cover"
                     onerror="this.onerror=null; this.src='https://placehold.co/400x400/3f3f46/ffffff?text=Art+${artwork.id}'; this.style.opacity='0.7';">
            </div>
            <!-- 작품 상세 설명 칸 -->
            <div class="artwork-card-content p-3 bg-gray-700">
                <h4 class="text-lg font-bold truncate">${artworkTitle}</h4>
                <p class="text-xs text-gray-400">${artistName}</p>
            </div>
        </div>
    `;
}

/**
 * 작품 그리드를 렌더링하고 페이지네이션을 업데이트하는 함수입니다.
 */
function renderArtworkGrid(data, page) {
    const gridContainer = document.getElementById('artworkGrid');
    if (!gridContainer) return;

    const startIndex = (page - 1) * artworksPerPage;
    const endIndex = startIndex + artworksPerPage;
    const currentArtworks = data.slice(startIndex, endIndex);

    gridContainer.innerHTML = currentArtworks.map(createArtworkCard).join('');
    updatePaginationControls(data.length, page);
}

/**
 * 페이지네이션 컨트롤 UI를 업데이트하는 함수입니다.
 */
function updatePaginationControls(totalArtworks, page) {
    const totalPages = Math.ceil(totalArtworks / artworksPerPage);
    const pageInfoElement = document.getElementById('pageInfo');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    if (pageInfoElement) {
        pageInfoElement.textContent = `${page} / ${totalPages} 페이지`;
    }

    if (prevButton) {
        prevButton.disabled = (page === 1);
        prevButton.classList.toggle('opacity-50', page === 1);
    }
    if (nextButton) {
        nextButton.disabled = (page === totalPages);
        nextButton.classList.toggle('opacity-50', page === totalPages);
    }
}

/**
 * 페이지네이션 컨트롤에 이벤트 리스너를 추가하는 함수입니다.
 */
function setupPaginationListeners() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const totalPages = Math.ceil(currentTradeData.length / artworksPerPage);

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentTradePage > 1) {
                currentTradePage--;
                renderArtworkGrid(currentTradeData, currentTradePage);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentTradePage < totalPages) {
                currentTradePage++;
                renderArtworkGrid(currentTradeData, currentTradePage);
            }
        });
    }

    // 정렬 드롭다운 이벤트 리스너
    const sortCriteria = document.getElementById('sortCriteria');
    if (sortCriteria) {
        sortCriteria.addEventListener('change', (e) => {
            const criteria = e.target.value;
            // TODO: 여기에 실제 정렬 로직을 추가하여 currentTradeData를 업데이트
            console.log(`작품을 ${criteria} 기준으로 정렬합니다.`);
            currentTradePage = 1;
            renderArtworkGrid(currentTradeData, currentTradePage);
        });
    }
}


/**
 * 거래하기 페이지 초기화 함수
 */
function initTradePage() {
    renderArtworkGrid(currentTradeData, currentTradePage);
    setupPaginationListeners();
}