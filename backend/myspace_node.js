// node-page.js

$(document).ready(function() {
    const $nodeMap = $('#nodeMap');
    let isDragging = false;
    let $currentMemo = null;
    let offset = { x: 0, y: 0 };

    // --- 1. 메모 생성 (빈 화면 더블클릭) ---
    $nodeMap.on('dblclick', function(e) {
        // 이미 메모 박스를 편집 중이거나, 노드 위를 클릭한 경우 무시
        if ($(e.target).is('.memo-text') || $(e.target).closest('.node').length) {
            return;
        }

        // 새 메모 박스 생성
        const $newMemo = $('<div class="mini-memo-box"></div>');
        $newMemo.css({
            left: e.pageX - $nodeMap.offset().left - 100 + 'px', // 클릭 위치를 중앙으로 조정
            top: e.pageY - $nodeMap.offset().top - 20 + 'px'
        });

        // 텍스트 영역 추가 및 자동 포커스
        const $textarea = $('<textarea class="memo-text"></textarea>');
        $textarea.val('새 메모');
        $newMemo.append($textarea);
        $nodeMap.append($newMemo);

        $textarea.focus();
        $newMemo.addClass('editing');
        
        // 엔터키 입력 완료
        $textarea.on('keypress', function(e) {
            if (e.which === 13) { // 13은 Enter 키 코드
                e.preventDefault();
                $textarea.blur();
            }
        });
        
        // 포커스 잃으면(편집 완료)
        $textarea.on('blur', function() {
            if ($(this).val().trim() === '') {
                $(this).val('새 메모'); // 비어있으면 기본값
            }
            $newMemo.removeClass('editing');
        });

        setupMemoDragging($newMemo);
    });

    // --- 2. 메모 드래그 설정 ---
    function setupMemoDragging($memo) {
        $memo.on('mousedown', function(e) {
            if ($(e.target).is('.memo-text')) return; // 텍스트 편집 중에는 드래그 막기

            isDragging = true;
            $currentMemo = $memo;
            $currentMemo.css('cursor', 'grabbing');

            // 마우스 포인터와 메모 박스 좌상단과의 오프셋 계산
            offset.x = e.clientX - $currentMemo.offset().left;
            offset.y = e.clientY - $currentMemo.offset().top;

            e.preventDefault();
        });
    }

    $(document).on('mousemove', function(e) {
        if (!isDragging || !$currentMemo) return;

        // 노드 맵 영역을 기준으로 위치 계산
        const mapOffset = $nodeMap.offset();

        let newX = e.clientX - offset.x - mapOffset.left;
        let newY = e.clientY - offset.y - mapOffset.top;

        $currentMemo.css({
            left: newX + 'px',
            top: newY + 'px'
        });
    });

    $(document).on('mouseup', function() {
        if (isDragging && $currentMemo) {
            $currentMemo.css('cursor', 'grab');
        }
        isDragging = false;
        $currentMemo = null;
    });

    // 초기 메모 드래그 설정 (페이지 로드 시 기존 메모가 있다면)
    $('.mini-memo-box').each(function() {
        setupMemoDragging($(this));
    });

    // --- 3. 메모 삭제 (Delete 키) ---
    $(document).on('keydown', function(e) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const $focusedElement = $(document.activeElement);
            
            // 텍스트 에어리어에서 Delete/Backspace를 눌렀다면 텍스트 삭제로 간주
            if ($focusedElement.is('.memo-text')) {
                return; 
            }
            
            // 현재 드래그 중이거나 포커스된 메모가 있다면 삭제
            // (여기서는 단순화를 위해 마지막에 클릭된 메모를 지우는 것으로 가정)
            const $memoToDelete = $('.mini-memo-box:hover').last();

            if ($memoToDelete.length) {
                $memoToDelete.remove();
                e.preventDefault(); // 기본 브라우저 동작 방지
            }
        }
    });

    // 초기 마우스 커서 설정
    $nodeMap.css('cursor', 'default');
});

// node-page.js

$(document).ready(function() {
    const $nodeMap = $('#nodeMap');
    const $svg = $('#nodeConnectors');
    const $nodes = $('.node'); // 모든 노드와 메모를 선택

    let isDragging = false;
    let $currentNode = null;
    let offset = { x: 0, y: 0 };

    // --- 1. 연결 정보 정의 (이미지 기반) ---
    // [시작 노드 ID, 끝 노드 ID]
    const connections = [
        ['node-art1', 'node-p1'],        // ART 1 -> Project 1
        ['node-art1', 'node-p2'],        // ART 1 -> Project 2
        
        ['node-p1', 'node-p1-1-proj'],   // Project 1 -> Project 1-1 (노드끼리 직접 연결)

        ['node-p2', 'node-p2-1-proj'],   // Project 2 -> Project 2-1
        ['node-p2', 'node-p2-2-proj']    // Project 2 -> Project 2-2
    ];

    // --- 2. SVG 선 그리기 함수 (동적 연결) ---
    function drawConnectors() {
        $svg.empty(); // 기존 선 지우기

        connections.forEach(([startId, endId]) => {
            const $startNode = $('#' + startId);
            const $endNode = $('#' + endId);

            if ($startNode.length && $endNode.length) {
                // 노드 맵 영역에 대한 상대적인 중앙 좌표 계산
                const startPos = {
                    x: $startNode.position().left + $startNode.outerWidth() / 2,
                    y: $startNode.position().top + $startNode.outerHeight() / 2
                };
                const endPos = {
                    x: $endNode.position().left + $endNode.outerWidth() / 2,
                    y: $endNode.position().top + $endNode.outerHeight() / 2
                };

                // SVG Path 요소 생성
                // M: MoveTo, L: LineTo. 직선으로 연결
                const pathData = `M${startPos.x} ${startPos.y} L${endPos.x} ${endPos.y}`;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                line.setAttribute('d', pathData);
                line.setAttribute('stroke', '#FF5900'); // 주황색 선
                line.setAttribute('stroke-width', '2'); // 얇은 선
                line.setAttribute('fill', 'none');
                $svg.append(line);
            }
        });
    }
    
    // --- 3. 노드 드래그 로직 ---
    $nodes.on('mousedown', function(e) {
        if ($(e.target).is('button') || $(e.target).is('a')) return; // 버튼 클릭 방지

        isDragging = true;
        $currentNode = $(this);
        $currentNode.css('cursor', 'grabbing');
        $currentNode.addClass('dragging'); // 드래그 중임을 표시

        // 마우스 포인터와 노드 좌상단과의 오프셋 계산
        offset.x = e.clientX - $currentNode.offset().left;
        offset.y = e.clientY - $currentNode.offset().top;

        e.preventDefault();
    });

    $(document).on('mousemove', function(e) {
        if (!isDragging || !$currentNode) return;

        // 노드 맵 영역을 기준으로 위치 계산
        const mapOffset = $nodeMap.offset();

        let newX = e.clientX - offset.x - mapOffset.left;
        let newY = e.clientY - offset.y - mapOffset.top;

        $currentNode.css({
            left: newX + 'px',
            top: newY + 'px'
        });
        
        // ✨ 노드 이동 시 연결선 즉시 업데이트
        drawConnectors();
    });

    $(document).on('mouseup', function() {
        if (isDragging && $currentNode) {
            $currentNode.css('cursor', 'grab');
            $currentNode.removeClass('dragging');
        }
        isDragging = false;
        $currentNode = null;
    });

    // --- 4. 초기 실행 ---
    drawConnectors(); // 페이지 로드 시 선 그리기
    
    // 윈도우 크기 변경 시 선 다시 그리기
    $(window).on('resize', drawConnectors); 
});