
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    console.log('클립보드에 복사되었습니다.');
}

// 버튼 클릭 이벤트 처리
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent.trim().replace(/\s/g, ''); // 공백 제거
        
        // 프롬프트 박스 안의 버튼인지 확인 (오버레이 내부에 있는지 확인)
        if (button.closest('.absolute.inset-0')) {
            // 블러 처리된 상태이므로 복사할 텍스트를 하드코딩된 원본으로 사용
            const promptText = "A cute, friendly robot astronaut character design, volumetric lighting, digital art, high detail, vibrant colors, cartoon style, smooth texture, inspired by Pixar and Disney, cinematic shot, 8k resolution, trending on Artstation. The helmet is reflecting a small star field. --ar 1:1 --v 6.0\nAdditional hidden parameters: <model: sd> <style: cute> <camera: close-up>";
            
            if (action === '복사하기') {
                copyToClipboard(promptText);
                console.log('프롬프트가 복사되었습니다.');
            } else if (action === '공유하기') {
                // 실제 공유 기능 (더미)
                console.log('공유하기 기능이 실행되었습니다.');
            } else if (action === '다운받기') {
                // 실제 다운로드 기능 (더미)
                console.log('작품 다운로드가 요청되었습니다.');
            }
        } else if (action === '구매하기') {
            // 구매 기능 (더미)
            console.log('작품 구매가 요청되었습니다. 코인 차감 로직 실행.');
        }
    });
});