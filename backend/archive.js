// 작품보관함.js
$(document).ready(function() {
    
    // 작품 아이템 전체 또는 상세 보기 버튼 클릭 이벤트
    $('.artwork-item, .btn-detail').on('click', function(e) {
        
        // 버튼 클릭이 아닌 작품 영역 클릭 시에도 상세 페이지로 이동
        const $item = $(this).hasClass('artwork-item') ? $(this) : $(this).closest('.artwork-item');
        const artworkId = $item.data('id');
        
        if (artworkId) {
            // 상세 페이지 경로: 작품 ID를 쿼리 파라미터로 전달
            window.location.href = `/frontend/pages/작품상세.html?id=${artworkId}`;
        }

        // 버튼 클릭 시 이벤트 버블링 방지 (상위 artwork-item 클릭이 중복되지 않도록)
        if ($(e.target).is('.btn-detail')) {
            e.stopPropagation();
        }
    });


});