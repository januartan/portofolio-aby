const dataProduk = {

    "Dobujack": {
        harga: 350000,
        gambar: "img/dobujack.jpg"
    },

    "Hooligans": {
        harga: 300000,
        gambar: "img/hooligans.jpg"
    },

    "Trouble Marker": {
        harga: 325000,
        gambar: "img/troubleMarker.jpg"
    }

};


let totalBayar = 0;

let dataKeranjang = [];

let indexEdit = -1;


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(angka) {

    return "Rp " +
        Number(angka).toLocaleString("id-ID");

}


/* =========================================================
   PILIH PRODUK
========================================================= */

function ubahHarga() {

    const nama =
        document.getElementById("namaBarang").value;

    const harga =
        document.getElementById("harga");

    const gambar =
        document.getElementById("gambarProduk");

    const placeholder =
        document.getElementById("fotoPlaceholder");

    const namaPreview =
        document.getElementById("namaPreview");


    if (dataProduk[nama]) {

        harga.value =
            dataProduk[nama].harga;

        gambar.src =
            dataProduk[nama].gambar;

        gambar.style.display =
            "block";

        if (placeholder) {

            placeholder.style.display =
                "none";

        }

        if (namaPreview) {

            namaPreview.innerText =
                nama;

        }

    } else {

        harga.value = "";

        gambar.src = "";

        gambar.style.display =
            "none";

        if (placeholder) {

            placeholder.style.display =
                "flex";

        }

        if (namaPreview) {

            namaPreview.innerText =
                "Belum dipilih";

        }

    }

}


/* =========================================================
   TAMBAH / UPDATE
========================================================= */

function tambahBarang() {

    const nama =
        document.getElementById("namaBarang").value;

    const ukuran =
        document.getElementById("ukuran").value;

    const jumlah =
        parseInt(
            document.getElementById("jumlah").value
        );


    if (
        nama === "" ||
        ukuran === "" ||
        !jumlah ||
        jumlah <= 0
    ) {

        alert(
            "Semua data harus diisi dengan benar!"
        );

        return;

    }


    const produk =
        dataProduk[nama];

    const harga =
        produk.harga;

    const total =
        harga * jumlah;


    /* =====================================================
       MODE UPDATE
    ===================================================== */

    if (indexEdit !== -1) {

        dataKeranjang[indexEdit] = {

            nama: nama,

            ukuran: ukuran,

            harga: harga,

            jumlah: jumlah,

            total: total,

            gambar: produk.gambar

        };


        indexEdit = -1;


        document.getElementById(
            "btnTambah"
        ).innerHTML =
            "<span>＋</span> Tambah ke Keranjang";


        document.getElementById(
            "btnBatal"
        ).style.display =
            "none";


        hitungTotal();

        renderTable();

        resetForm();

        return;

    }


    /* =====================================================
       TAMBAH BARANG BARU
    ===================================================== */

    dataKeranjang.push({

        nama: nama,

        ukuran: ukuran,

        harga: harga,

        jumlah: jumlah,

        total: total,

        gambar: produk.gambar

    });


    hitungTotal();

    renderTable();

    resetForm();

}


/* =========================================================
   RENDER TABLE
========================================================= */

function renderTable() {

    const tabel =
        document.getElementById(
            "daftarBelanja"
        );


    tabel.innerHTML = "";


    if (dataKeranjang.length === 0) {

        tabel.innerHTML = `

            <tr id="dataKosong">

                <td colspan="7">

                    <div class="empty-state">

                        <div>🛒</div>

                        <strong>
                            Belum ada belanjaan
                        </strong>

                        <span>
                            Tambahkan produk ke keranjang
                        </span>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    dataKeranjang.forEach(
        (item, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.nama}
                </td>

                <td>
                    ${item.ukuran}
                </td>

                <td>
                    ${formatRupiah(item.harga)}
                </td>

                <td>
                    ${item.jumlah}
                </td>

                <td>
                    ${formatRupiah(item.total)}
                </td>

                <td>

                    <img
                        src="${item.gambar}"
                        alt="${item.nama}"
                    >

                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="btn-edit"
                            onclick="editBarang(${index})"
                            title="Edit">

                            ✏️

                        </button>


                        <button
                            class="btn-delete"
                            onclick="hapusBarang(${index})"
                            title="Hapus">

                            🗑️

                        </button>

                    </div>

                </td>

            `;


            tabel.appendChild(row);

        }
    );


    document.getElementById(
        "jumlahItem"
    ).innerText =
        dataKeranjang.length;

}


/* =========================================================
   HITUNG TOTAL
========================================================= */

function hitungTotal() {

    totalBayar = 0;


    dataKeranjang.forEach(
        item => {

            totalBayar +=
                item.total;

        }
    );


    document.getElementById(
        "totalPembayaran"
    ).innerText =
        formatRupiah(totalBayar);

}


/* =========================================================
   EDIT BARANG
========================================================= */

function editBarang(index) {

    const item =
        dataKeranjang[index];


    indexEdit = index;


    document.getElementById(
        "namaBarang"
    ).value =
        item.nama;


    document.getElementById(
        "ukuran"
    ).value =
        item.ukuran;


    document.getElementById(
        "harga"
    ).value =
        item.harga;


    document.getElementById(
        "jumlah"
    ).value =
        item.jumlah;


    ubahHarga();


    document.getElementById(
        "btnTambah"
    ).innerHTML =
        "✓ Update Produk";


    document.getElementById(
        "btnBatal"
    ).style.display =
        "block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   HAPUS BARANG
========================================================= */

function hapusBarang(index) {

    const item =
        dataKeranjang[index];


    const yakin =
        confirm(
            `Hapus ${item.nama} dari keranjang?`
        );


    if (!yakin) {

        return;

    }


    dataKeranjang.splice(
        index,
        1
    );


    hitungTotal();

    renderTable();


    if (indexEdit === index) {

        batalEdit();

    }

}


/* =========================================================
   BATAL EDIT
========================================================= */

function batalEdit() {

    indexEdit = -1;


    document.getElementById(
        "btnTambah"
    ).innerHTML =
        "<span>＋</span> Tambah ke Keranjang";


    document.getElementById(
        "btnBatal"
    ).style.display =
        "none";


    resetForm();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    document.getElementById(
        "namaBarang"
    ).value = "";


    document.getElementById(
        "ukuran"
    ).value = "";


    document.getElementById(
        "harga"
    ).value = "";


    document.getElementById(
        "jumlah"
    ).value = "";


    const gambar =
        document.getElementById(
            "gambarProduk"
        );


    gambar.src = "";

    gambar.style.display =
        "none";


    const placeholder =
        document.getElementById(
            "fotoPlaceholder"
        );


    if (placeholder) {

        placeholder.style.display =
            "flex";

    }


    const namaPreview =
        document.getElementById(
            "namaPreview"
        );


    if (namaPreview) {

        namaPreview.innerText =
            "Belum dipilih";

    }

}


/* =========================================================
   LOAD AWAL
========================================================= */

renderTable();

hitungTotal();