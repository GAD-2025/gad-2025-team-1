document.addEventListener('DOMContentLoaded', () => {
    
    // URL 파라미터에서 ID 확인 (추후 API 연동 시 사용)
    const urlParams = new URLSearchParams(window.location.search);
    const artworkId = urlParams.get('id');
    if (artworkId) {
        console.log(`Loaded artwork ID: ${artworkId}`);
        // 여기서 나중에 fetchArtworkDetail(artworkId) 등을 호출
    }

    // 구매하기 버튼
    const buyBtn = document.querySelector('.buy-btn');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            if(confirm('1500 코인을 사용하여 구매하시겠습니까?')) {
                alert('구매가 완료되었습니다! (시뮬레이션)');
                // UI 업데이트: 블러 제거 등
                document.querySelector('.prompt-overlay').style.display = 'none';
                document.querySelector('.blur-text').style.filter = 'none';
            }
        });
    }

    // 복사 버튼
    const copyBtns = document.querySelectorAll('.action-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = "A cute, friendly robot astronaut character design... (Original Prompt)";
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('프롬프트가 복사되었습니다.');
            }).catch(err => {
                console.error('복사 실패:', err);
            });
        });
    });
});