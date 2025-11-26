// 더미 데이터
const ARTWORK_DATA = [
    { id: 1, title: "환상의 숲", artist: "이작가", price: 300, color: "38761d", tags: ["숲", "환상"] },
    { id: 2, title: "도시의 그림자", artist: "김작가", price: 550, color: "674ea7", tags: ["도시", "컨셉아트"] },
    { id: 3, title: "미래 도시 건축", artist: "박작가", price: 720, color: "1c4587", tags: ["SF", "건축"] },
    { id: 4, title: "사이버펑크 네온", artist: "최작가", price: 450, color: "783f04", tags: ["사이버펑크"] },
    { id: 5, title: "고대 유적의 빛", artist: "정작가", price: 680, color: "cc0000", tags: ["추상", "유적"] },
    { id: 6, title: "초현실주의 꽃", artist: "윤작가", price: 320, color: "38761d", tags: ["꽃", "일러스트"] },
    { id: 7, title: "미니멀 풍경", artist: "오작가", price: 500, color: "674ea7", tags: ["미니멀", "풍경"] },
    { id: 8, title: "추상 회화 01", artist: "강작가", price: 780, color: "1c4587", tags: ["추상"] },
    { id: 9, title: "우주 여행자", artist: "한작가", price: 890, color: "783f04", tags: ["SF", "우주"] },
    { id: 10, title: "고양이 로봇", artist: "배작가", price: 620, color: "cc0000", tags: ["고양이", "귀여움"] },
];

const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let filteredData = [...ARTWORK_DATA];

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search_query');

    if (searchQuery) {
        document.getElementById('tradeSearchInput').value = searchQuery;
        handleSearch(searchQuery);
    } else {
        renderGrid();
    }

    // 이벤트 리스너 등록
    document.getElementById('tradeSearchBtn').addEventListener('click', () => {
        const query = document.getElementById('tradeSearchInput').value;
        handleSearch(query);
    });

    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
    
    document.getElementById('sortCriteria').addEventListener('change', (e) => {
        handleSort(e.target.value);
    });
});

function handleSearch(query) {
    if (!query) {
        filteredData = [...ARTWORK_DATA];
        document.getElementById('searchResultTitle').textContent = '전체 작품';
    } else {
        const lowerQuery = query.toLowerCase();
        filteredData = ARTWORK_DATA.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) || 
            item.artist.toLowerCase().includes(lowerQuery) ||
            item.tags.some(tag => tag.includes(lowerQuery))
        );
        document.getElementById('searchResultTitle').textContent = `'${query}' 검색 결과 (${filteredData.length}건)`;
    }
    currentPage = 1;
    renderGrid();
}

function handleSort(criteria) {
    if (criteria === 'price_asc') {
        filteredData.sort((a, b) => a.price - b.price);
    } else if (criteria === 'price_desc') {
        filteredData.sort((a, b) => b.price - a.price);
    } else if (criteria === 'recent') {
        filteredData.sort((a, b) => b.id - a.id); // ID 역순을 최신으로 가정
    }
    renderGrid();
}

function changePage(direction) {
    const maxPage = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const nextPage = currentPage + direction;
    if (nextPage >= 1 && nextPage <= maxPage) {
        currentPage = nextPage;
        renderGrid();
    }
}

function renderGrid() {
    const grid = document.getElementById('artworkGrid');
    grid.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = filteredData.slice(start, end);

    pageData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.onclick = () => {
            // 상세 페이지로 이동 (ID 포함)
            window.location.href = `marketplace_detail.html?id=${item.id}`;
        };

        card.innerHTML = `
            <div class="artwork-thumb">
                <img src="https://placehold.co/400x400/${item.color}/ffffff?text=${encodeURIComponent(item.title)}" class="artwork-img" alt="${item.title}">
            </div>
            <div class="artwork-info">
                <h4 class="artwork-title">${item.title}</h4>
                <div class="flex justify-between items-center mt-1">
                    <p class="artwork-artist">${item.artist}</p>
                    <p class="artwork-price">${item.price} C</p>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    updatePaginationUI();
}

function updatePaginationUI() {
    const maxPage = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
    document.getElementById('pageInfo').textContent = `${currentPage} / ${maxPage} 페이지`;
    document.getElementById('prevPage').disabled = (currentPage === 1);
    document.getElementById('nextPage').disabled = (currentPage === maxPage);
}