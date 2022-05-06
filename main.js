const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0, // lấy ra bài hát đầu tiên của mảng
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // Tạo config cho cấu hình
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    // Đây là api của bài hát
    songs : [
        {
            name: 'Nevada',
            singer: 'Vicetone, Cozi',
            path: './asstes/music/song1.mp3',
            imgae: './asstes/img/img1.jpg'
        },

        {
            name: 'SummerTime',
            singer: 'Cinamons, Evening Cinema',
            path: './asstes/music/song2.mp3',
            imgae: './asstes/img/img2.jpg'
        },

        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng M-TP',
            path: './asstes/music/song3.mp3',
            imgae: './asstes/img/img3.jpg'
        },

        {
            name: 'Có chắc yêu là đây',
            singer: 'Sơn Tùng M-TP',
            path: './asstes/music/song4.mp3',
            imgae: './asstes/img/img4.jpg'
        },

        {
            name: 'Mình cưới nhau đi',
            singer: 'Huỳnh Jame, Pjnboys',
            path: './asstes/music/song5.mp3',
            imgae: './asstes/img/img5.jpg'
        },

        {
            name: 'Monsters',
            singer: 'Katie Sky, Timeflies',
            path: './asstes/music/song6.mp3',
            imgae: './asstes/img/img6.jpg'
        },

        {
            name: 'Hạ Còn Vương Nắng',
            singer: 'Datkaa',
            path: './asstes/music/song7.mp3',
            imgae: './asstes/img/img7.jpg'
        },

        {
            name: 'Tình Ka',
            singer: 'G5R',
            path: './asstes/music/song8.mp3',
            imgae: './asstes/img/img8.jpg'
        },

        {
            name: 'DayDream',
            singer: 'Soobin Hoàng Sơn',
            path: './asstes/music/song9.mp3',
            imgae: './asstes/img/img9.jpg'
        },

        {
            name: 'Despacito',
            singer: 'Luis Fonsi',
            path: './asstes/music/song10.mp3',
            imgae: './asstes/img/img10.jpg'
        },
    ],
    // Lấy config từ config trên
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // đây là hàm để tải lại bài hát
    render: function() {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" 
                    style="background-image: url('${song.imgae}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer }</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>  
            `
        })
        playlist.innerHTML = html.join('')
    },
    // Định nghĩa thuộc tính
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Đây là hàm lắng nghe, xử lý các sự kiện Dom
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth;// xét chiều rộng của đĩa cd

        // xử lý đĩa cd khi quay
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
                duration: 10000,
                interations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ đĩa cd
        document.onscroll = function() {// đây dùng để kéo lên xuống trong Dom
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0// Đây dùng để kéo lên thì đĩa cd sẽ từ từ mất đi
            cd.style.opacity = newCdWidth / cdWidth// Đây là để kéo lên thì đĩa cd sẽ từ từ mờ dần đi
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {// nếu mà nhạc đang chạy thì khi ta click vào nút btn
                audio.pause();// nhấn vô bài hát là sẽ dừng lại
            }else {// còn ngược lại bài hát ko chạy thì khi click vào btn nó sẽ chạy
                audio.play();
            }
        }

        // Khi bài hát đc play( chạy)
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi bài hát bị dừng pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        
        // Khi tiến độ bài hát thay đổi (nút kéo input)
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

         // Khi next bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lý khi bật / tắt nút random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý next song khi audio ended ( kết thúc sẽ qua bài hát)
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            }else{
                nextBtn.click()
            }
        }

        // Xử lý lặp lại 1 bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)// do currentIndex là số nên (songNode.dataset.index) sẽ là chuỗi cần cho vào Number
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option (...)
                if(e.target.closest('.option')) {

                }
            }
        }

    },
    // Đây dùng để scrollToActiveSong, khi bài nào có active thì nó sẽ trượt xuống tới bài đó
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block : 'center',
                inline: 'nearest'
            });
        },500)
    },

    // Đây là hàm tải lại thông tin bài hát
    loadCurrentSong : function() {
        heading.textContent = this.currentSong.name //đây dùng để lấy tên bài hát
        cdThumb.style.backgroundImage = `url('${this.currentSong.imgae}')`// đây là lấy hình ảnh bài hát
        audio.src = this.currentSong.path// đây là đường dẫn của bài hát
    },
    
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor( Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Đây là render tải lại bài hát
        this.render()

        // Đây là lắng nghe / xử lý sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong()

        //Hiển thị trạng thái ban đầu của button repeatBtn và randomBtn
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()