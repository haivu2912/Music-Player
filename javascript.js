const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORE_KEY = 'MUSIC_PLAYER';
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORE_KEY)) || {},
    songs: [
        {
            name: 'Yêu em từ bé',
            singer: 'HuyR ft Phi Nhung',
            path: './asset/music/YeuEmTuBe-HuyRPhiNhung.mp3',
            image: './asset/img/yeuemtube.jpg'
        },

        {
            name: 'Trên tình bạn dưới tình yêu',
            singer: 'Min ft Typh',
            path: './asset/music/TrenTinhBanDuoiTinhYeu-MIN16Typh.mp3',
            image: './asset/img/trentinhbanduoitinhyeu.jpg'
        },

        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            path: './asset/music/NangTho-HoangDung.mp3',
            image: './asset/img/nangtho.jpg'
        },

        {
            name: 'Mãi mãi bên nhau',
            singer: 'Noo Phước Thịnh',
            path: './asset/music/MaiMaiBenNhau-NooPhuocThinh.mp3',
            image: './asset/img/maimaibennhau.jpg'
        },

        {
            name: 'Hoa nở không màu',
            singer: 'Hoài Lâm',
            path: './asset/music/HoaNoKhongMau-HoaiLam.mp3',
            image: './asset/img/hoanokhongmau.jpg'
        },

        {
            name: 'Hai triệu năm',
            singer: 'Đen',
            path: './asset/music/HaiTrieuNam-DenBien.mp3',
            image: './asset/img/haitrieunam.jpg'
        },

        {
            name: 'Gác lại âu lo',
            singer: 'DaLAB ft Miu Lê',
            path: './asset/music/GacLaiAuLo-DaLABMiuLe.mp3',
            image: './asset/img/gaclaiaulo.jpg'
        },

        {
            name: 'Duyên âm',
            singer: 'Hoàng Thùy Linh',
            path: './asset/music/DuyenAm-HoangThuyLinh.mp3',
            image: './asset/img/duyenam.jpg'
        },

        {
            name: 'Cô gái vàng',
            singer: 'HuyR ft Tùng Viu',
            path: './asset/music/CoGaiVang-HuyRTungViu.mp3',
            image: './asset/img/cogaivang.jpg'
        },

        {
            name: 'Nhà em ở lưng đồi',
            singer: 'Thùy Chi',
            path: './asset/music/NhaEmOLungDoi-ThuyChi.mp3',
            image: './asset/img/nhaemolungdoi.jpg'
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return`
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý quay và dừng CD
        const cdThumbAnimated = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000, // 10s
            iterations: Infinity
        });
        cdThumbAnimated.pause();
        // Xử lý phòng to, thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;
        }

        // Xứ lý khi play
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        // Khi play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimated.play();
        }

        // Khi pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimated.pause();
        }

        // Xử lý thanh tiến độ bài hát
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToAciveSong();
        }

        // Khi pre bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.preSong();
            }
            audio.play();
            _this.render();
            _this.scrollToAciveSong();
        }

        // Khi random bài hát
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Chuyển bài hát khi bài hiện tại kết thúc
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }

        // Phái lại bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Khi click bài hát trong playlist
        playlist.onclick = function(e) {
            // e: là event
            // target: đích nơi mà event click vào
            const songNode = e.target.closest('.song:not(.active');
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                if(e.target.closest('.option')){
                    console.log('still update');
                }
            }
        }
    },

    scrollToAciveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300);
        
        if(this.currentIndex == 0){
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 300);
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    preSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe và xử lý sự kiện
        this.handleEvent();

        // Hiện thông tin bài hát hiện tại lên UI khi chạy 
        this.loadCurrentSong();

        // In ra danh sách bài hát
        this.render();

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start();