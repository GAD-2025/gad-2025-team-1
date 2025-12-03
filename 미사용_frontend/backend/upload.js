// 이미지 업로드 기능
document.addEventListener('DOMContentLoaded', function() {
    const imageUploadBox = document.getElementById('imageUploadBox');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImageBtn');

    // 업로드 박스 클릭 시 파일 선택 창 열기
    imageUploadBox.addEventListener('click', function() {
        imageInput.click();
    });

    // 파일 선택 시 미리보기 표시
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                imageUploadBox.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 이미지 제거 버튼
    removeImageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        previewImage.src = '';
        imageInput.value = '';
        previewContainer.style.display = 'none';
        imageUploadBox.style.display = 'flex';
    });

    // 키워드 버튼 토글 기능
    document.querySelectorAll('.keyword-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.keyword-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // AI 가격 제안 버튼
    const aiPriceButton = document.querySelector('.ai-price-button');
    if (aiPriceButton) {
        aiPriceButton.addEventListener('click', function() {
            alert('AI가 적정 가격을 분석 중입니다...');
        });
    }

    // 공개 설정 버튼
    const visibilityButton = document.querySelector('.visibility-button');
    if (visibilityButton) {
        visibilityButton.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.innerHTML = '비공개 <span class="eye-icon">👁</span>';
            } else {
                this.classList.add('active');
                this.innerHTML = '공개 <span class="eye-icon">👁</span>';
            }
        });
    }

    // 작품 업로드 제출 버튼
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // 필수 입력 항목 검증
            const descriptionInput = document.querySelector('.description-input');
            const priceInput = document.querySelector('.price-input');
            const promptInput = document.querySelector('.prompt-input');

            if (!imageInput.files[0]) {
                alert('작품 이미지를 업로드해주세요.');
                return;
            }

            if (!descriptionInput.value.trim()) {
                alert('작품 설명을 입력해주세요.');
                descriptionInput.focus();
                return;
            }

            if (!priceInput.value.trim()) {
                alert('가격 정보를 입력해주세요.');
                priceInput.focus();
                return;
            }

            if (!promptInput.value.trim()) {
                alert('프롬프트를 입력해주세요.');
                promptInput.focus();
                return;
            }

            // 업로드 성공 메시지 및 페이지 이동
            alert('작품이 성공적으로 업로드되었습니다!');
            // 작품보관함으로 이동
            window.location.href = 'archive.html';
        });
    }
});
