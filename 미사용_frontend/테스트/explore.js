document.addEventListener('DOMContentLoaded', () => {
    // 검색 버튼 기능
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // 검색어를 쿼리 파라미터로 담아 거래하기 페이지로 이동
            window.location.href = `marketplace.html?search_query=${encodeURIComponent(query)}`;
        } else {
            alert('검색어를 입력해주세요.');
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // 태그 클릭 기능
    const tags = document.querySelectorAll('.tag-pill');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const keyword = tag.getAttribute('data-tag');
            // 태그 클릭 시 바로 검색 결과 페이지로 이동
            window.location.href = `marketplace.html?search_query=${encodeURIComponent(keyword)}`;
        });
    });
});