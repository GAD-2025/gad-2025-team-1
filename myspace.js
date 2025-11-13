// script.js (jQuery 사용)
$(document).ready(function() {
    const $orbitArea = $('.artwork-orbit-area');
    const $outerOrbit = $('.orbit-outer');
    const $innerOrbit = $('.orbit-inner');
    const $artworks = $('.artwork-item'); // 모든 작품 아이템 선택

    let isDragging = false;
    let startX;
    let rotationAngle = 0; // 현재 회전 각도

   // script.js (jQuery 사용)

// ... (이전 코드 동일) ...

    // 궤도 회전을 위한 회전각 업데이트 함수
    function updateOrbitRotation() {
        // 1. 궤도 자체를 회전
        // 궤도 전체가 회전하며 그 위에 배치된 작품들을 이동시킵니다.
        $outerOrbit.css('transform', `rotate(${rotationAngle}deg)`);
        $innerOrbit.css('transform', `rotate(${-rotationAngle * 0.7}deg)`);

        // 2. 작품 아이템 역회전 (작품이 항상 정면을 바라보도록)
        // CSS에서 이미 작품의 위치는 고정되었으므로, 회전 값만 적용합니다.

        // 바깥 궤도 작품: 궤도의 회전과 반대로 회전
        $('.orbit-outer .artwork-item').css('transform', `rotate(${-rotationAngle}deg)`);
        
        // 안쪽 궤도 작품: 안쪽 궤도의 회전과 반대로 회전 (다시 양수)
        const innerOrbitRotation = -rotationAngle * 0.7;
        $('.orbit-inner .artwork-item').css('transform', `rotate(${-innerOrbitRotation}deg)`);
    }

// ... (이전 코드 동일) ...

    // 1. 마우스 누르기 (드래그 시작)
    $orbitArea.on('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        $orbitArea.css('cursor', 'grabbing');
        e.preventDefault();
    });

    // 2. 마우스 이동 (드래그 중)
    $(document).on('mousemove', function(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const rotationDelta = deltaX * 0.2; // 회전 속도 조절

        rotationAngle += rotationDelta;
        updateOrbitRotation();

        startX = e.clientX;
    });

    // 3. 마우스 떼기 (드래그 종료)
    $(document).on('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            $orbitArea.css('cursor', 'grab');
        }
    });

    // 초기 궤도 회전 설정
    $orbitArea.css('cursor', 'grab');
    updateOrbitRotation();
});