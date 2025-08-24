// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAzYZMxqNmnLMGYnCyiJYPg2MbxZMt0co0",
    authDomain: "osama-91b95.firebaseapp.com",
    databaseURL: "https://osama-91b95-default-rtdb.firebaseio.com",
    projectId: "osama-91b95",
    storageBucket: "osama-91b95.appspot.com",
    messagingSenderId: "118875905722",
    appId: "1:118875905722:web:200bff1bd99db2c1caac83",
    measurementId: "G-LEM5PVPJZC"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// متغيرات عامة
let currentProduct = null;

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    // تهيئة الصفحات
    if (page === 'index.html' || page === '') {
        initHomePage();
    } else if (page === 'auth.html') {
        initAuthPage();
    } else if (page === 'add-post.html') {
        initAddPostPage();
    } else if (page === 'profile.html') {
        initProfilePage();
    } else if (page === 'post-details.html') {
        initPostDetailsPage();
    } else if (page === 'payment.html') {
        initPaymentPage();
    } else if (page === 'admin.html') {
        initAdminPage();
    }
});

// تهيئة الصفحة الرئيسية
function initHomePage() {
    loadPosts();
    
    document.getElementById('profile-icon').addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            window.location.href = 'profile.html';
        } else {
            window.location.href = 'auth.html';
        }
    });
    
    document.getElementById('add-post-icon').addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            window.location.href = 'payment.html';
        } else {
            window.location.href = 'auth.html';
        }
    });
    
    document.getElementById('home-icon').addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
}

// تهيئة صفحة التوثيق
function initAuthPage() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const closeAuthBtn = document.getElementById('close-auth');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    closeAuthBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'login') {
                document.getElementById('login-form').classList.remove('hidden');
                document.getElementById('signup-form').classList.add('hidden');
            } else {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('signup-form').classList.remove('hidden');
            }
        });
    });
    
    loginBtn.addEventListener('click', e => {
        e.preventDefault();
        login();
    });
    
    signupBtn.addEventListener('click', e => {
        e.preventDefault();
        signup();
    });
}

// تهيئة صفحة إضافة المنشور
function initAddPostPage() {
    const publishBtn = document.getElementById('publish-btn');
    const chooseImageBtn = document.getElementById('choose-image-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const postImageInput = document.getElementById('post-image');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const closeAddPostBtn = document.getElementById('close-add-post');
    
    closeAddPostBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    chooseImageBtn.addEventListener('click', () => {
        postImageInput.click();
    });
    
    cameraBtn.addEventListener('click', () => {
        postImageInput.setAttribute('capture', 'environment');
        postImageInput.click();
    });
    
    postImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            document.getElementById('image-name').textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview-img').src = e.target.result;
                document.getElementById('image-preview').classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });
    
    removeImageBtn.addEventListener('click', () => {
        postImageInput.value = '';
        document.getElementById('image-name').textContent = 'لم يتم اختيار صورة';
        document.getElementById('image-preview').classList.add('hidden');
    });
    
    publishBtn.addEventListener('click', async e => {
        e.preventDefault();
        await publishPost();
    });
}

// تهيئة صفحة الملف الشخصي
function initProfilePage() {
    const logoutBtn = document.getElementById('logout-btn');
    const closeProfileBtn = document.getElementById('close-profile');
    
    closeProfileBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    });
    
    loadUserProfile();
}

// تهيئة صفحة تفاصيل المنشور
function initPostDetailsPage() {
    const buyNowBtn = document.getElementById('buy-now-btn');
    const closePostDetailsBtn = document.getElementById('close-post-details');
    
    closePostDetailsBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    buyNowBtn.addEventListener('click', () => {
        window.location.href = 'payment.html';
    });
    
    loadPostDetails();
}

// تهيئة صفحة الدفع
function initPaymentPage() {
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const closePaymentBtn = document.getElementById('close-payment');
    
    closePaymentBtn.addEventListener('click', () => {
        window.location.href = 'post-details.html';
    });
    
    confirmPaymentBtn.addEventListener('click', async e => {
        e.preventDefault();
        await confirmPayment();
    });
    
    loadPaymentDetails();
}

// تهيئة لوحة التحكم
function initAdminPage() {
    const closeAdminBtn = document.getElementById('close-admin');
    const adminTabs = document.querySelectorAll('.admin-tabs .tab-btn');
    const clearNotificationsBtn = document.getElementById('clear-notifications');
    const recordTransferBtn = document.getElementById('record-transfer-btn');
    const ordersFilter = document.getElementById('orders-filter');
    
    closeAdminBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            if (tabName === 'orders') {
                document.getElementById('admin-orders').classList.remove('hidden');
            } else if (tabName === 'notifications') {
                document.getElementById('admin-notifications').classList.remove('hidden');
            } else if (tabName === 'transfers') {
                document.getElementById('admin-transfers').classList.remove('hidden');
            }
        });
    });
    
    clearNotificationsBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
            database.ref('admin_notifications').remove()
                .then(() => {
                    document.getElementById('notifications-list').innerHTML = '<p>لا توجد إشعارات</p>';
                })
                .catch(error => {
                    console.error('Error deleting notifications:', error);
                    alert('حدث خطأ أثناء حذف الإشعارات');
                });
        }
    });
    
    recordTransferBtn.addEventListener('click', async () => {
        const account = document.getElementById('transfer-account').value;
        const amount = document.getElementById('transfer-amount').value;
        const reference = document.getElementById('transfer-reference').value;
        
        if (!account || !amount || !reference) {
            alert('يرجى ملء جميع الحقول');
            return;
        }
        
        try {
            await database.ref('transfers').push({
                account: account,
                amount: amount,
                reference: reference,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            
            alert('تم تسجيل التحويل بنجاح');
            document.getElementById('transfer-account').value = '';
            document.getElementById('transfer-amount').value = '';
            document.getElementById('transfer-reference').value = '';
        } catch (error) {
            console.error('Error saving transfer:', error);
            alert('حدث خطأ أثناء تسجيل التحويل');
        }
    });
    
    ordersFilter.addEventListener('change', (e) => {
        loadAdminOrders(e.target.value);
    });
    
    loadAdminDashboard();
}

// وظائف التطبيق الأساسية
async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    const postsRef = database.ref('posts');
    
    postsRef.on('value', (snapshot) => {
        postsContainer.innerHTML = '';
        
        if (snapshot.exists()) {
            const posts = snapshot.val();
            Object.keys(posts).reverse().forEach(postId => {
                const post = posts[postId];
                createPostCard(post, postId);
            });
        } else {
            postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد. كن أول من ينشر!</p>';
        }
    });
}

function createPostCard(post, postId) {
    const postsContainer = document.getElementById('posts-container');
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.id = postId;
    
    const imageContent = post.imageUrl 
        ? `<div class="post-image"><img src="${post.imageUrl}" alt="${post.title}"></div>`
        : `<div class="post-image"><i class="fas fa-image fa-3x"></i></div>`;
    
    postCard.innerHTML = `
        ${imageContent}
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-meta">
                ${post.price ? `<div class="post-price">${post.price}</div>` : ''}
                <div class="post-location"><i class="fas fa-map-marker-alt"></i> ${post.location}</div>
            </div>
            <div class="post-author">
                <i class="fas fa-user"></i> ${post.authorName}
            </div>
        </div>
    `;
    
    postCard.addEventListener('click', () => {
        window.location.href = `post-details.html?postId=${postId}`;
    });
    
    postsContainer.appendChild(postCard);
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showAuthMessage('تم تسجيل الدخول بنجاح!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showAuthMessage(getAuthErrorMessage(error.code), 'error');
    }
}

async function signup() {
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const address = document.getElementById('signup-address').value;
    const account = document.getElementById('signup-account').value;
    
    if (!name || !phone || !email || !password || !address || !account) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await database.ref('users/' + user.uid).set({
            name: name,
            phone: phone,
            email: email,
            address: address,
            account: account
        });
        
        showAuthMessage('تم إنشاء الحساب بنجاح!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showAuthMessage(getAuthErrorMessage(error.code), 'error');
    }
}

async function publishPost() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-description').value;
    const price = document.getElementById('post-price').value;
    const location = document.getElementById('post-location').value;
    const phone = document.getElementById('post-phone').value;
    const imageFile = document.getElementById('post-image').files[0];
    
    if (!title || !description || !location || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        // إظهار شاشة التحميل
        document.getElementById('loading-overlay').classList.remove('hidden');
        document.getElementById('upload-progress').style.width = '0%';
        
        let imageUrl = null;
        if (imageFile) {
            const fileRef = storage.ref('post_images/' + Date.now() + '_' + imageFile.name);
            const uploadTask = fileRef.put(imageFile);
            
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        document.getElementById('upload-progress').style.width = progress + '%';
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        resolve();
                    }
                );
            });
            
            imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
        }
        
        const userRef = database.ref('users/' + user.uid);
        const userSnapshot = await userRef.once('value');
        
        if (!userSnapshot.exists()) {
            throw new Error('بيانات المستخدم غير موجودة');
        }
        
        const userData = userSnapshot.val();
        
        const postData = {
            title: title,
            description: description,
            price: price || '',
            location: location,
            phone: phone,
            authorId: user.uid,
            authorName: userData.name,
            authorPhone: userData.phone,
            sellerAccount: userData.account,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            imageUrl: imageUrl || ''
        };
        
        await database.ref('posts').push(postData);
        
        document.getElementById('loading-overlay').classList.add('hidden');
        alert('تم نشر المنشور بنجاح!');
        window.location.href = 'index.html';
    } 
    catch (error) {
        console.error('Error adding post: ', error);
        document.getElementById('loading-overlay').classList.add('hidden');
        alert('حدث خطأ أثناء نشر المنشور: ' + error.message);
    }
}

async function loadUserProfile() {
    const user = auth.currentUser;
    const userInfo = document.getElementById('user-info');
    
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    const userRef = database.ref('users/' + user.uid);
    const userSnapshot = await userRef.once('value');
    
    if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        userInfo.innerHTML = `
            <div class="user-detail">
                <i class="fas fa-user"></i>
                <span>${userData.name}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-envelope"></i>
                <span>${userData.email}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-phone"></i>
                <span>${userData.phone}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span>${userData.address}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-wallet"></i>
                <span>${userData.account}</span>
            </div>
        `;
    } else {
        userInfo.innerHTML = '<p>لا توجد بيانات للمستخدم</p>';
    }
}

async function loadPostDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    const postRef = database.ref('posts/' + postId);
    const postSnapshot = await postRef.once('value');
    
    if (!postSnapshot.exists()) {
        window.location.href = 'index.html';
        return;
    }
    
    const post = postSnapshot.val();
    post.id = postId;
    currentProduct = post;
    
    document.getElementById('detail-title').textContent = post.title;
    document.getElementById('detail-description').textContent = post.description;
    document.getElementById('detail-location').textContent = post.location;
    document.getElementById('detail-author').textContent = post.authorName;
    document.getElementById('detail-phone').textContent = post.phone;
    document.getElementById('detail-account').textContent = post.sellerAccount || 'غير متوفر';
    
    if (post.price) {
        document.getElementById('detail-price').textContent = post.price;
        document.getElementById('detail-price').style.display = 'block';
    } else {
        document.getElementById('detail-price').style.display = 'none';
    }
    
    if (post.imageUrl) {
        document.getElementById('detail-img').src = post.imageUrl;
        document.getElementById('detail-img').style.display = 'block';
    } else {
        document.getElementById('detail-img').style.display = 'none';
    }
}

async function loadPaymentDetails() {
    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('payment-product-title').textContent = currentProduct.title;
    document.getElementById('payment-product-price').textContent = currentProduct.price || 'السعر غير محدد';
    document.getElementById('seller-account').value = currentProduct.sellerAccount || 'غير متوفر';
    
    if (currentProduct.imageUrl) {
        document.getElementById('payment-product-img').src = currentProduct.imageUrl;
        document.getElementById('payment-product-img').style.display = 'block';
    } else {
        document.getElementById('payment-product-img').style.display = 'none';
    }
}

async function confirmPayment() {
    const buyerName = document.getElementById('buyer-name').value;
    const buyerPhone = document.getElementById('buyer-phone').value;
    const senderName = document.getElementById('sender-name').value;
    const transactionId = document.getElementById('transaction-id').value;
    const buyerAddress = document.getElementById('buyer-address').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    if (!buyerName || !buyerPhone || !senderName || !transactionId || !buyerAddress) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!agreeTerms) {
        alert('يرجى الموافقة على شروط الاستخدام');
        return;
    }
    
    const orderData = {
        productId: currentProduct.id,
        productTitle: currentProduct.title,
        productPrice: currentProduct.price,
        buyerName: buyerName,
        buyerPhone: buyerPhone,
        buyerAddress: buyerAddress,
        senderName: senderName,
        transactionId: transactionId,
        sellerAccount: currentProduct.sellerAccount,
        sellerId: currentProduct.authorId,
        sellerName: currentProduct.authorName,
        status: "قيد المراجعة",
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    try {
        await database.ref('orders').push(orderData);
        sendAdminNotification(orderData);
        alert('تم استلام طلبك بنجاح! سيتواصل معك فريقنا خلال 24 ساعة لتأكيد العملية.');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error saving order:', error);
        alert('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
    }
}

async function loadAdminDashboard() {
    loadAdminOrders();
    loadAdminNotifications();
    loadTransfersHistory();
}

async function loadAdminOrders(status = 'all') {
    const ordersList = document.getElementById('orders-list');
    const ordersRef = database.ref('orders');
    
    ordersRef.on('value', (snapshot) => {
        ordersList.innerHTML = '';
        
        if (snapshot.exists()) {
            const orders = snapshot.val();
            Object.keys(orders).reverse().forEach(orderId => {
                const order = orders[orderId];
                if (status === 'all' || order.status === status) {
                    createOrderCard(order, orderId);
                }
            });
        } else {
            ordersList.innerHTML = '<p>لا توجد طلبات</p>';
        }
    });
}

function createOrderCard(order, orderId) {
    const ordersList = document.getElementById('orders-list');
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.innerHTML = `
        <div class="order-header">
            <div class="order-id">طلب #${orderId}</div>
            <div class="order-status status-${order.status.replace(/\s/g, '-')}">${order.status}</div>
        </div>
        
        <div class="order-details">
            <div class="order-detail-group">
                <h4>المنتج</h4>
                <p>${order.productTitle}</p>
                <p><strong>السعر:</strong> ${order.productPrice} ريال</p>
            </div>
            
            <div class="order-detail-group">
                <h4>المشتري</h4>
                <p>${order.buyerName}</p>
                <p><strong>الهاتف:</strong> ${order.buyerPhone}</p>
                <p><strong>العنوان:</strong> ${order.buyerAddress}</p>
            </div>
            
            <div class="order-detail-group">
                <h4>الدفع</h4>
                <p><strong>اسم المرسل:</strong> ${order.senderName}</p>
                <p><strong>رقم العملية:</strong> ${order.transactionId}</p>
            </div>
            
            <div class="order-detail-group">
                <h4>البائع</h4>
                <p>${order.sellerName}</p>
                <p><strong>حساب الكريمي:</strong> ${order.sellerAccount}</p>
            </div>
        </div>
        
        <div class="order-actions">
            <button class="btn btn-confirm" data-id="${orderId}">تأكيد الطلب</button>
            <button class="btn btn-shipped" data-id="${orderId}">تم الشحن</button>
            <button class="btn btn-complete" data-id="${orderId}">مكتمل</button>
            <button class="btn btn-cancel" data-id="${orderId}">إلغاء</button>
        </div>
    `;
    
    ordersList.appendChild(orderCard);
}

async function loadAdminNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    const notifRef = database.ref('admin_notifications');
    
    notifRef.on('value', (snapshot) => {
        notificationsList.innerHTML = '';
        
        if (snapshot.exists()) {
            const notifications = snapshot.val();
            Object.keys(notifications).reverse().forEach(notifId => {
                const notification = notifications[notifId];
                createNotificationCard(notification, notifId);
            });
        } else {
            notificationsList.innerHTML = '<p>لا توجد إشعارات</p>';
        }
    });
}

function createNotificationCard(notification, notifId) {
    const notificationsList = document.getElementById('notifications-list');
    const notifCard = document.createElement('div');
    notifCard.className = `notification-card ${notification.read ? '' : 'unread'}`;
    notifCard.innerHTML = `
        <div class="notification-content">
            <p>${notification.message}</p>
            <small>${formatDate(notification.timestamp)}</small>
        </div>
        <button class="btn-mark-read" data-id="${notifId}">تم القراءة</button>
    `;
    
    notificationsList.appendChild(notifCard);
}

async function loadTransfersHistory() {
    const transfersList = document.getElementById('transfers-list');
    const transfersRef = database.ref('transfers');
    
    transfersRef.on('value', (snapshot) => {
        transfersList.innerHTML = '';
        
        if (snapshot.exists()) {
            const transfers = snapshot.val();
            Object.keys(transfers).reverse().forEach(transferId => {
                const transfer = transfers[transferId];
                createTransferItem(transfer, transferId);
            });
        } else {
            transfersList.innerHTML = '<p>لا توجد تحويلات مسجلة</p>';
        }
    });
}

function createTransferItem(transfer, transferId) {
    const transfersList = document.getElementById('transfers-list');
    const transferItem = document.createElement('div');
    transferItem.className = 'transfer-item';
    transferItem.innerHTML = `
        <div>
            <div><strong>${transfer.account}</strong></div>
            <div>${transfer.reference}</div>
        </div>
        <div>
            <div>${transfer.amount} ريال</div>
            <small>${formatDate(transfer.timestamp)}</small>
        </div>
    `;
    
    transfersList.appendChild(transferItem);
}

function sendAdminNotification(order) {
    const notification = {
        type: 'new_order',
        message: `طلب جديد: ${order.productTitle} من ${order.buyerName}`,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        read: false
    };
    
    database.ref('admin_notifications').push(notification);
}

function showAuthMessage(message, type) {
    const authMessage = document.getElementById('auth-message');
    authMessage.textContent = message;
    authMessage.className = '';
    authMessage.classList.add(type + '-message');
}

function getAuthErrorMessage(code) {
    switch(code) {
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صالح';
        case 'auth/user-disabled':
            return 'هذا الحساب معطل';
        case 'auth/user-not-found':
            return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        case 'auth/wrong-password':
            return 'كلمة المرور غير صحيحة';
        case 'auth/email-already-in-use':
            return 'هذا البريد الإلكتروني مستخدم بالفعل';
        case 'auth/weak-password':
            return 'كلمة المرور ضعيفة (يجب أن تحتوي على 6 أحرف على الأقل)';
        default:
            return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
    }
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
        }    } else if (page === 'payment.html') {
        initPaymentPage();
    } else if (page === 'admin.html') {
        initAdminPage();
    }
});

// تهيئة الصفحة الرئيسية
function initHomePage() {
    loadPosts();
    
    document.getElementById('profile-icon').addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            window.location.href = 'profile.html';
        } else {
            window.location.href = 'auth.html';
        }
    });
    
    document.getElementById('add-post-icon').addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            window.location.href = 'payment.html';
        } else {
            window.location.href = 'auth.html';
        }
    });
    
    document.getElementById('home-icon').addEventListener('click', () => {
        window.location.href ='admin.html';
    });
}

// تهيئة صفحة التوثيق
function initAuthPage() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const closeAuthBtn = document.getElementById('close-auth');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    closeAuthBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'login') {
                document.getElementById('login-form').classList.remove('hidden');
                document.getElementById('signup-form').classList.add('hidden');
            } else {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('signup-form').classList.remove('hidden');
            }
        });
    });
    
    loginBtn.addEventListener('click', e => {
        e.preventDefault();
        login();
    });
    
    signupBtn.addEventListener('click', e => {
        e.preventDefault();
        signup();
    });
}

// تهيئة صفحة إضافة المنشور
function initAddPostPage() {
    const publishBtn = document.getElementById('publish-btn');
    const chooseImageBtn = document.getElementById('choose-image-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const postImageInput = document.getElementById('post-image');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const closeAddPostBtn = document.getElementById('close-add-post');
    
    closeAddPostBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    chooseImageBtn.addEventListener('click', () => {
        postImageInput.click();
    });
    
    cameraBtn.addEventListener('click', () => {
        postImageInput.setAttribute('capture', 'environment');
        postImageInput.click();
    });
    
    postImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            document.getElementById('image-name').textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview-img').src = e.target.result;
                document.getElementById('image-preview').classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });
    
    removeImageBtn.addEventListener('click', () => {
        postImageInput.value = '';
        document.getElementById('image-name').textContent = 'لم يتم اختيار صورة';
        document.getElementById('image-preview').classList.add('hidden');
    });
    
    publishBtn.addEventListener('click', async e => {
        e.preventDefault();
        await publishPost();
    });
}

// تهيئة صفحة الملف الشخصي
function initProfilePage() {
    const logoutBtn = document.getElementById('logout-btn');
    const closeProfileBtn = document.getElementById('close-profile');
    
    closeProfileBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    });
    
    loadUserProfile();
}

// تهيئة صفحة تفاصيل المنشور
function initPostDetailsPage() {
    const buyNowBtn = document.getElementById('buy-now-btn');
    const closePostDetailsBtn = document.getElementById('close-post-details');
    
    closePostDetailsBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    buyNowBtn.addEventListener('click', () => {
        window.location.href = 'payment.html';
    });
    
    loadPostDetails();
}

// تهيئة صفحة الدفع
function initPaymentPage() {
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const closePaymentBtn = document.getElementById('close-payment');
    
    closePaymentBtn.addEventListener('click', () => {
        window.location.href = 'post-details.html';
    });
    
    confirmPaymentBtn.addEventListener('click', async e => {
        e.preventDefault();
        await confirmPayment();
    });
    
    loadPaymentDetails();
}

// تهيئة لوحة التحكم
function initAdminPage() {
    const closeAdminBtn = document.getElementById('close-admin');
    const adminTabs = document.querySelectorAll('.admin-tabs .tab-btn');
    const clearNotificationsBtn = document.getElementById('clear-notifications');
    const recordTransferBtn = document.getElementById('record-transfer-btn');
    const ordersFilter = document.getElementById('orders-filter');
    
    closeAdminBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            if (tabName === 'orders') {
                document.getElementById('admin-orders').classList.remove('hidden');
            } else if (tabName === 'notifications') {
                document.getElementById('admin-notifications').classList.remove('hidden');
            } else if (tabName === 'transfers') {
                document.getElementById('admin-transfers').classList.remove('hidden');
            }
        });
    });
    
    clearNotificationsBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
            database.ref('admin_notifications').remove()
                .then(() => {
                    document.getElementById('notifications-list').innerHTML = '<p>لا توجد إشعارات</p>';
                })
                .catch(error => {
                    console.error('Error deleting notifications:', error);
                    alert('حدث خطأ أثناء حذف الإشعارات');
                });
        }
    });
    
    recordTransferBtn.addEventListener('click', async () => {
        const account = document.getElementById('transfer-account').value;
        const amount = document.getElementById('transfer-amount').value;
        const reference = document.getElementById('transfer-reference').value;
        
        if (!account || !amount || !reference) {
            alert('يرجى ملء جميع الحقول');
            return;
        }
        
        try {
            await database.ref('transfers').push({
                account: account,
                amount: amount,
                reference: reference,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            
            alert('تم تسجيل التحويل بنجاح');
            document.getElementById('transfer-account').value = '';
            document.getElementById('transfer-amount').value = '';
            document.getElementById('transfer-reference').value = '';
        } catch (error) {
            console.error('Error saving transfer:', error);
            alert('حدث خطأ أثناء تسجيل التحويل');
        }
    });
    
    ordersFilter.addEventListener('change', (e) => {
        loadAdminOrders(e.target.value);
    });
    
    loadAdminDashboard();
}

// وظائف التطبيق الأساسية
async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    const postsRef = database.ref('posts');
    
    postsRef.on('value', (snapshot) => {
        postsContainer.innerHTML = '';
        
        if (snapshot.exists()) {
            const posts = snapshot.val();
            Object.keys(posts).reverse().forEach(postId => {
                const post = posts[postId];
                createPostCard(post, postId);
            });
        } else {
            postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد. كن أول من ينشر!</p>';
        }
    });
}

function createPostCard(post, postId) {
    const postsContainer = document.getElementById('posts-container');
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.id = postId;
    
    const imageContent = post.imageUrl 
        ? `<div class="post-image"><img src="${post.imageUrl}" alt="${post.title}"></div>`
        : `<div class="post-image"><i class="fas fa-image fa-3x"></i></div>`;
    
    postCard.innerHTML = `
        ${imageContent}
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-meta">
                ${post.price ? `<div class="post-price">${post.price}</div>` : ''}
                <div class="post-location"><i class="fas fa-map-marker-alt"></i> ${post.location}</div>
            </div>
            <div class="post-author">
                <i class="fas fa-user"></i> ${post.authorName}
            </div>
        </div>
    `;
    
    postCard.addEventListener('click', () => {
        window.location.href = `post-details.html?postId=${postId}`;
    });
    
    postsContainer.appendChild(postCard);
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showAuthMessage('تم تسجيل الدخول بنجاح!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showAuthMessage(getAuthErrorMessage(error.code), 'error');
    }
}

async function signup() {
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const address = document.getElementById('signup-address').value;
    const account = document.getElementById('signup-account').value;
    
    if (!name || !phone || !email || !password || !address || !account) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await database.ref('users/' + user.uid).set({
            name: name,
            phone: phone,
            email: email,
            address: address,
            account: account
        });
        
        showAuthMessage('تم إنشاء الحساب بنجاح!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showAuthMessage(getAuthErrorMessage(error.code), 'error');
    }
}

async function publishPost() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-description').value;
    const price = document.getElementById('post-price').value;
    const location = document.getElementById('post-location').value;
    const phone = document.getElementById('post-phone').value;
    const imageFile = document.getElementById('post-image').files[0];
    
    if (!title || !description || !location || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        // إظهار شاشة التحميل
        document.getElementById('loading-overlay').classList.remove('hidden');
        document.getElementById('upload-progress').style.width = '0%';
        
        let imageUrl = null;
        if (imageFile) {
            const fileRef = storage.ref('post_images/' + Date.now() + '_' + imageFile.name);
            const uploadTask = fileRef.put(imageFile);
            
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        document.getElementById('upload-progress').style.width = progress + '%';
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        resolve();
                    }
                );
            });
            
            imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
        }
        
        const userRef = database.ref('users/' + user.uid);
        const userSnapshot = await userRef.once('value');
        
        if (!userSnapshot.exists()) {
            throw new Error('بيانات المستخدم غير موجودة');
        }
        
        const userData = userSnapshot.val();
        
        const postData = {
            title: title,
            description: description,
            price: price || '',
            location: location,
            phone: phone,
            authorId: user.uid,
            authorName: userData.name,
            authorPhone: userData.phone,
            sellerAccount: userData.account,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            imageUrl: imageUrl || ''
        };
        
        await database.ref('posts').push(postData);
        
        document.getElementById('loading-overlay').classList.add('hidden');
        alert('تم نشر المنشور بنجاح!');
        window.location.href = 'index.html';
    } 
    catch (error) {
        console.error('Error adding post: ', error);
        document.getElementById('loading-overlay').classList.add('hidden');
        alert('حدث خطأ أثناء نشر المنشور: ' + error.message);
    }
}

async function loadUserProfile() {
    const user = auth.currentUser;
    const userInfo = document.getElementById('user-info');
    
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    const userRef = database.ref('users/' + user.uid);
    const userSnapshot = await userRef.once('value');
    
    if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        userInfo.innerHTML = `
            <div class="user-detail">
                <i class="fas fa-user"></i>
                <span>${userData.name}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-envelope"></i>
                <span>${userData.email}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-phone"></i>
                <span>${userData.phone}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-map-marker-alt"></i>
                <span>${userData.address}</span>
            </div>
            <div class="user-detail">
                <i class="fas fa-wallet"></i>
                <span>${userData.account}</span>
            </div>
        `;
    } else {
        userInfo.innerHTML = '<p>لا توجد بيانات للمستخدم</p>';
    }
}

async function loadPostDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    const postRef = database.ref('posts/' + postId);
    const postSnapshot = await postRef.once('value');
    
    if (!postSnapshot.exists()) {
        window.location.href = 'index.html';
        return;
    }
    
    const post = postSnapshot.val();
    post.id = postId;
    currentProduct = post;
    
    document.getElementById('detail-title').textContent = post.title;
    document.getElementById('detail-description').textContent = post.description;
    document.getElementById('detail-location').textContent = post.location;
    document.getElementById('detail-author').textContent = post.authorName;
    document.getElementById('detail-phone').textContent = post.phone;
    document.getElementById('detail-account').textContent = post.sellerAccount || 'غير متوفر';
    
    if (post.price) {
        document.getElementById('detail-price').textContent = post.price;
        document.getElementById('detail-price').style.display = 'block';
    } else {
        document.getElementById('detail-price').style.display = 'none';
    }
    
    if (post.imageUrl) {
        document.getElementById('detail-img').src = post.imageUrl;
        document.getElementById('detail-img').style.display = 'block';
    } else {
        document.getElementById('detail-img').style.display = 'none';
    }
}

async function loadPaymentDetails() {
    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('payment-product-title').textContent = currentProduct.title;
    document.getElementById('payment-product-price').textContent = currentProduct.price || 'السعر غير محدد';
    document.getElementById('seller-account').value = currentProduct.sellerAccount || 'غير متوفر';
    
    if (currentProduct.imageUrl) {
        document.getElementById('payment-product-img').src = currentProduct.imageUrl;
        document.getElementById('payment-product-img').style.display = 'block';
    } else {
        document.getElementById('payment-product-img').style.display = 'none';
    }
}

async function confirmPayment() {
    const buyerName = document.getElementById('buyer-name').value;
    const buyerPhone = document.getElementById('buyer-phone').value;
    const senderName = document.getElementById('sender-name').value;
    const transactionId = document.getElementById('transaction-id').value;
    const buyerAddress = document.getElementById('buyer-address').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    if (!buyerName || !buyerPhone || !senderName || !transactionId || !buyerAddress) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!agreeTerms) {
        alert('يرجى الموافقة على شروط الاستخدام');
        return;
    }
    
    const orderData = {
        productId: currentProduct.id,
        productTitle: currentProduct.title,
        productPrice: currentProduct.price,
        buyerName: buyerName,
        buyerPhone: buyerPhone,
        buyerAddress: buyerAddress,
        senderName: senderName,
        transactionId: transactionId,
        sellerAccount: currentProduct.sellerAccount,
        sellerId: currentProduct.authorId,
        sellerName: currentProduct.authorName,
        status: "قيد المراجعة",
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    try {
        await database.ref('orders').push(orderData);
        sendAdminNotification(orderData);
        alert('تم استلام طلبك بنجاح! سيتواصل معك فريقنا خلال 24 ساعة لتأكيد العملية.');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error saving order:', error);
        alert('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
    }
}

async function loadAdminDashboard() {
    loadAdminOrders();
    loadAdminNotifications();
    loadTransfersHistory();
}

async function loadAdminOrders(status = 'all') {
    const ordersList = document.getElementById('orders-list');
    const ordersRef = database.ref('orders');
    
    ordersRef.on('value', (snapshot) => {
        ordersList.innerHTML = '';
        
        if (snapshot.exists()) {
            const orders = snapshot.val();
            Object.keys(orders).reverse().forEach(orderId => {
                const order = orders[orderId];
                if (status === 'all' || order.status === status) {
                    createOrderCard(order, orderId);
                }
            });
        } else {
            ordersList.innerHTML = '<p>لا توجد طلبات</p>';
        }
    });
}

function createOrderCard(order, orderId) {
    const ordersList = document.getElementById('orders-list');
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.innerHTML = `
        <div class="order-header">
            <div class="order-id">طلب #${orderId}</div>
            <div class="order-status status-${order.status.replace(/\s/g, '-')}">${order.status}</div>
        </div>
        
        <div class="order-details">
            <div class="order-detail-group">
                <h4>المنتج</h4>
                <p>${order.productTitle}</p>
                <p><strong>السعر:</strong> ${order.productPrice} ريال</p>
            </div>
            
            <div class="order-detail-group">
                <h4>المشتري</h4>
                <p>${order.buyerName}</p>
                <p><strong>الهاتف:</strong> ${order.buyerPhone}</p>
                <p><strong>العنوان:</strong> ${order.buyerAddress}</p>
            </div>
            
            <div class="order-detail-group">
                <h4>الدفع</h4>
                <p><strong>اسم المرسل:</strong> ${order.senderName}</p>
                <p><strong>رقم العملية:</strong> ${order.transactionId}</p>
            </div>
            
            <div class="order-detail-group">
                <h4>البائع</h4>
                <p>${order.sellerName}</p>
                <p><strong>حساب الكريمي:</strong> ${order.sellerAccount}</p>
            </div>
        </div>
        
        <div class="order-actions">
            <button class="btn btn-confirm" data-id="${orderId}">تأكيد الطلب</button>
            <button class="btn btn-shipped" data-id="${orderId}">تم الشحن</button>
            <button class="btn btn-complete" data-id="${orderId}">مكتمل</button>
            <button class="btn btn-cancel" data-id="${orderId}">إلغاء</button>
        </div>
    `;
    
    ordersList.appendChild(orderCard);
}

async function loadAdminNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    const notifRef = database.ref('admin_notifications');
    
    notifRef.on('value', (snapshot) => {
        notificationsList.innerHTML = '';
        
        if (snapshot.exists()) {
            const notifications = snapshot.val();
            Object.keys(notifications).reverse().forEach(notifId => {
                const notification = notifications[notifId];
                createNotificationCard(notification, notifId);
            });
        } else {
            notificationsList.innerHTML = '<p>لا توجد إشعارات</p>';
        }
    });
}

function createNotificationCard(notification, notifId) {
    const notificationsList = document.getElementById('notifications-list');
    const notifCard = document.createElement('div');
    notifCard.className = `notification-card ${notification.read ? '' : 'unread'}`;
    notifCard.innerHTML = `
        <div class="notification-content">
            <p>${notification.message}</p>
            <small>${formatDate(notification.timestamp)}</small>
        </div>
        <button class="btn-mark-read" data-id="${notifId}">تم القراءة</button>
    `;
    
    notificationsList.appendChild(notifCard);
}

async function loadTransfersHistory() {
    const transfersList = document.getElementById('transfers-list');
    const transfersRef = database.ref('transfers');
    
    transfersRef.on('value', (snapshot) => {
        transfersList.innerHTML = '';
        
        if (snapshot.exists()) {
            const transfers = snapshot.val();
            Object.keys(transfers).reverse().forEach(transferId => {
                const transfer = transfers[transferId];
                createTransferItem(transfer, transferId);
            });
        } else {
            transfersList.innerHTML = '<p>لا توجد تحويلات مسجلة</p>';
        }
    });
}

function createTransferItem(transfer, transferId) {
    const transfersList = document.getElementById('transfers-list');
    const transferItem = document.createElement('div');
    transferItem.className = 'transfer-item';
    transferItem.innerHTML = `
        <div>
            <div><strong>${transfer.account}</strong></div>
            <div>${transfer.reference}</div>
        </div>
        <div>
            <div>${transfer.amount} ريال</div>
            <small>${formatDate(transfer.timestamp)}</small>
        </div>
    `;
    
    transfersList.appendChild(transferItem);
}

function sendAdminNotification(order) {
    const notification = {
        type: 'new_order',
        message: `طلب جديد: ${order.productTitle} من ${order.buyerName}`,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        read: false
    };
    
    database.ref('admin_notifications').push(notification);
}

function showAuthMessage(message, type) {
    const authMessage = document.getElementById('auth-message');
    authMessage.textContent = message;
    authMessage.className = '';
    authMessage.classList.add(type + '-message');
}

function getAuthErrorMessage(code) {
    switch(code) {
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صالح';
        case 'auth/user-disabled':
            return 'هذا الحساب معطل';
        case 'auth/user-not-found':
            return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        case 'auth/wrong-password':
            return 'كلمة المرور غير صحيحة';
        case 'auth/email-already-in-use':
            return 'هذا البريد الإلكتروني مستخدم بالفعل';
        case 'auth/weak-password':
            return 'كلمة المرور ضعيفة (يجب أن تحتوي على 6 أحرف على الأقل)';
        default:
            return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
    }
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
}
