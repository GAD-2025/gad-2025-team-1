$(document).ready(function() {

    const artworkData = {
        '1': {
            title: '픽셀의 경계',
            artist: 'Pixel Weaver',
            created: '25/10/1',
            modified: '25/10/4',
            image: '../이미지/카페.png',
            prompt: '아름다운 고양이가 커다란 찻잔 위에 앉아 있으며, 주변에는 커피와 초콜릿 같은 카페 아이템들이 산재해 있다.'
        },
        '2': {
            title: '동화의 꿀',
            artist: '404 Creator',
            created: '25/10/1',
            modified: '25/10/4',
            image: '../이미지/네온플라워.png',
            prompt: '우아한 고양이가 커다란 찻잔 위에 앉아 있으며, 주변에는 커피와 초콜릿, 아이스크림 같은 카페 아이템들이 산재해 있다.'
        },
        '3': {
            title: '바다',
            artist: 'Synapse_7',
            created: '25/10/1',
            modified: '25/10/4',
            image: '../이미지/문.png',
            prompt: '신비로운 분위기의 금문, 불을 들고 서있는 인물, 따뜻한 빛이 나오는 방'
        },
        '4': {
            title: '픽셀의 경계',
            artist: 'Pixel Weaver',
            created: '25/10/1',
            modified: '25/10/4',
            image: '../이미지/우주기타.png',
            prompt: '우주 공간에 떠있는 거대한 기타, 주변에 행성들과 별들, 네온 분위기'
        },
        '5': {
            title: '주시위 놀이',
            artist: '404 Creator',
            created: '25/10/1',
            modified: '25/10/4',
            image: '../이미지/나무위인형.png',
            prompt: '밝은 숲, 나무 위의 귀여운 인형들, 파스텔 톤의 색감, 따뜻한 분위기'
        },
        '6': {
            title: '별의 정원',
            artist: 'Synapse_7',
            created: '25/10/1',
            modified: '25/10/4',
            image: '../이미지/네온플라워.png',
            prompt: '별이 빛나는 밤하늘, 화분 속의 신비로운 꽃들, 우주적 분위기'
        }
    };
    
    // URL에서 작품 ID 추출
    function getArtworkIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || '2';
    }

    // 작품 상세 정보 로드
    function loadArtworkDetail() {
        const id = getArtworkIdFromUrl();
        const data = artworkData[id];

        if (data) {
            $('#detail-title').text(data.title);
            $('#artwork-title').text(data.title);
            $('#artwork-artist').text(data.artist);
            $('#artwork-created').text(data.created);
            $('#artwork-modified').text(data.modified);
            $('#artwork-image').attr('src', data.image);
            $('#artwork-prompt').text(data.prompt);
        }
    }

    // 초기 로드
    loadArtworkDetail();
});