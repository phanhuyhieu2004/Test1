const STORAGE_KEY = 'products';

function getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getNextId() {
    const products = getProducts();
    if (products.length === 0) return 1;
    return Math.max(...products.map(p => p.id)) + 1;
}

function getUrlParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

function formatPrice(price) {
    return Number(price).toLocaleString('vi-VN') + 'đ';
}

function renderList() {
    const products = getProducts();
    const tbody = document.getElementById('productList');
    const emptyMsg = document.getElementById('emptyMsg');

    if (products.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${formatPrice(p.price)}</td>
            <td>${p.desc || '-'}</td>
            <td class="actions">
                <a href="detail.html?id=${p.id}" class="btn btn-detail">Xem</a>
                <a href="edit.html?id=${p.id}" class="btn btn-save">Sửa</a>
                <button onclick="deleteProduct(${p.id})" class="btn btn-delete">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function deleteProduct(id) {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return;
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    renderList();
}

function handleAdd() {
    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const products = getProducts();
        const newProduct = {
            id: getNextId(),
            name: document.getElementById('name').value.trim(),
            price: Number(document.getElementById('price').value),
            desc: document.getElementById('desc').value.trim()
        };
        products.push(newProduct);
        saveProducts(products);
        window.location.href = 'index.html';
    });
}

function handleEdit() {
    const id = Number(getUrlParam('id'));
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('desc').value = product.desc || '';

    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        product.name = document.getElementById('name').value.trim();
        product.price = Number(document.getElementById('price').value);
        product.desc = document.getElementById('desc').value.trim();
        saveProducts(products);
        window.location.href = 'index.html';
    });
}

function handleDetail() {
    const id = Number(getUrlParam('id'));
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('detailId').textContent = product.id;
    document.getElementById('detailName').textContent = product.name;
    document.getElementById('detailPrice').textContent = formatPrice(product.price);
    document.getElementById('detailDesc').textContent = product.desc || 'Không có mô tả';
    document.getElementById('editLink').href = `edit.html?id=${product.id}`;
}
