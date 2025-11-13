
function openModal(artworkName) {
    const modal = document.getElementById('artworkDetailModal');
    const modalTitle = modal.querySelector('h2');
    
    // 모달 내용 업데이트
    if (artworkName) {
        // 키워드 검색 결과일 경우 제목을 다르게 설정
        if (artworkName.startsWith('#')) {
             modalTitle.textContent = `${artworkName}에 대한 키워드 검색 결과 (작품 나열 시뮬레이션)`;
        } else if (artworkName.startsWith('키워드 검색 결과:')) {
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
 * 검색 버튼 클릭 시 동작하는 함수입니다.
 * 특정 키워드 입력 시 작품 상세 페이지 모달을 띄웁니다.
 */
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const keywords = ['트렌디', '미니멀', '추상', '풍경화', '컨셉아트'];

    if (keywords.includes(query)) {
        // 키워드가 일치하면 모달을 띄웁니다.
        openModal(`키워드 검색 결과: ${query}`);
    } else if (query !== '') {
        // 다른 키워드일 경우에도 검색바 동작 시뮬레이션을 위해 모달을 띄웁니다.
        openModal(`'${query}'에 대한 검색 결과 (작품 나열 시뮬레이션)`);
    }
    // 검색창을 비웁니다.
    searchInput.value = '';
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
});