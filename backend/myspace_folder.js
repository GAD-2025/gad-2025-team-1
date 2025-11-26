// archive.js

$(document).ready(function() {
    const $modal = $('#imageModal');
    const $modalImage = $('#modalImage');
    const $gridItems = $('.grid-item');

    // 1. 작품 클릭 시 모달 열기
    $gridItems.on('click', function() {
        // 클릭된 작품의 이미지 경로를 data-image 속성에서 가져옵니다.
        const imageUrl = $(this).data('image'); 
        
        // 이미지 경로가 제대로 찍히는지 확인하는 콘솔 로그 (개발자 도구 F12로 확인)
        console.log("클릭된 이미지 URL:", imageUrl); 
        
        // 모달 이미지에 경로를 설정합니다.
        $modalImage.attr('src', imageUrl);
        
        // 모달을 표시합니다.
        $modal.css('display', 'flex'); 
    });

    // 2. 모달 외부 영역 클릭 시 모달 닫기
    $modal.on('click', function(e) {
        if ($(e.target).is($modal)) { // 모달 외부 영역만 클릭 시 닫기
            $modal.css('display', 'none');
            $modalImage.attr('src', ''); // 이미지 경로 초기화 (리소스 확보)
        }
    });
});