import React, { Component } from 'react';
import { Card, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, CardFooter, InputGroup, InputGroupAddon, InputGroupText, CardHeader, CardBody, Row, Col } from "reactstrap";
import { renderToString } from 'react-dom/server'
import ImageUploader from '../../components/Products/ImageUploader/ImageUploader.jsx';
import { Label } from '../../components/UI/Form/Label/Label';
import { Prompt } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip'
import axios from 'axios';
import * as actionCreator from '../../store/action/index';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from '../../components/Spinner/Spinner';
import { Line } from 'rc-progress';


import {
    ProductList as ProductListAction,
    ProductCategory,
    ProductAdd,
    ProductEdit,
    ProductUpdate,
    ProductCategoryGeneral,
    NewCategoryAction,
    AuthorIndex,
    AuthorCreate,
    MaterialIndex,
    MaterialCreate,
    ListEmployee
} from '../../api/index';


class ProductEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            name: '',
            categoryGeneral: {
                id: 4,
                label: "Book",
                value: 4
            },
            category: [
                // { id: 1, value: 'Pertanian', label: 'Pertanian' },
                // { id: 2, value: 'Peternakan', label: 'Peternakan' },
                // { id: 3,value: 'Teknologi', label: 'Teknologi' }
            ],
            description: '',
            create_price: 0,
            published_price: 0,
            base_price: 0,
            promo_price: 0,
            unit: "Pcs",
            publish_date: new Date(),
            weight: 0,
            isbn: '',
            status: 'draft',
            height: 0,
            width: 0,
            thick: 0,
            stock_level: 0,
            version: 1,
            production_version: 1,
            sku: '',
            format: null,
            material: [],
            author: [],
            pages: 0,
            category_general_options: [],
            category_options: [
                // { id: 1, value: 'Pertanian', label: 'Pertanian' },
                // { id: 2, value: 'Peternakan', label: 'Peternakan' },
                // { id: 3,value: 'Teknologi', label: 'Teknologi' }
            ],
            materials: [
                // {id:1, value: 'Book Paper', label:'Book Paper'},
                // {id:2, value: 'Soft Cover', label:'Soft Cover'},
                // {id:3, value: 'Art Carton', label:'Art Carton'},
            ],
            authors_options: [
                // {id:1, value: 'Author 1', label:'Author 1'},
                // {id:2, value: 'Author 2', label:'Author 2'},
                // {id:3, value: 'Author 3', label:'Author 3'},
            ],
            addCategory: false,
            addAuthor: false,
            addMaterial: false,
            saveable: true,
            addMode: null,
            modal: false,
            newCategory: {
                name: '',
            },
            newAuthor: {
                name: '',
                occupation: '',
                phone: ''
            },
            newMaterial: {
                name: '',
            },
            thumbnailFile: [],
            productImagesUrl: [],
            sumFilled: 0,
            formNotFilledYet: [],
            prompt: true,
            edit_status: "new",
            productId: null,
            show_button_cat: false,
            show_button_author: false,
            show_button_material: false,
            // Detail untuk buku
            tim_penulis: '-',
            mou_data: new Date(),
            source_fin_publisher: 0,
            source_fin_author: 0,
            source_fin_sponsor: 0,
            pp: 0,
            pb: 0,
            royalti_percent: 0,

            editor_product: null,
            layouter_product: null,
            desainer_product: null,
            manager_proyek: null,

            user_blst: []

        }
    }

    formatuang(amount) {
        if (amount === null) {
            amount = 0;
        }
        // deletecomma
        let comadel = amount.toString().replace(/\,/g, '');
        let price = comadel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        return price;
    }

    onChangeMoneyHandler = (event) => {

        // validasi input tidak boleh huruf
        let values = event.target.value.toString().replace(/\,/g, '');
        // let isNum = /^\d+$/.test(values); // tanpakoma
        let isNum = /^[0-9]+\.?[0-9]*$/.test(values); // dengan koma output true or false                         
        let key = event.target.name;

        if (isNum || event.target.value === null) {
            this.setState({ [key]: parseFloat(values) })

            // jika yang diset adalah base_price, promo price akan mengikuti base price dan harus diisi
            if (key === "base_price") {
                this.setState({ promo_price: parseFloat(values) })
            }
        }
        else if (values.length <= 1) {
            this.setState({ [key]: 0 })

            // jika yang diset adalah base_price, promo price akan mengikuti base price dan harus diisi
            if (key === "base_price") {
                this.setState({ promo_price: 0 })
            }
        }
        this.countFilled();
    }

    onChangeNumberHandler = (event) => {

        // validasi input tidak boleh huruf
        let values = event.target.value.toString().replace(/\,/g, '');
        // let isNum = /^\d+$/.test(values); // tanpakoma
        let isNum = /^[0-9]+\.?[0-9]*$/.test(values); // dengan koma output true or false                         
        let key = event.target.name;

        while (values.charAt(0) === '0') {
            values = values.substr(1);
        }

        if (isNum || event.target.value === null) {
            this.setState({ [key]: (values) })
        }
        else if (values.length <= 1) {
            this.setState({ [key]: 0 })
        }
        this.countFilled();
    }

    newFormHandler = (event) => {
        event.preventDefault();
        let name = event.target.name;
        this.setState({ addAuthor: false, addMaterial: false, addCategory: false });
        this.setState({ [name]: true, modal: true })
    }

    hideModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    onUpdateHandler = (event) => {
        event.preventDefault();
        this.setState({ prompt: false }, () => {
            event.preventDefault();
            const content = this.state;
            ProductUpdate(content).then(res => {
                if (res.status === "success") {
                    const toaster = {
                        isOpenToast: true,
                        toastMessage: res.data.name + " Berhasil diUpdate",
                        toastType: 'success',
                    }
                    this.props.toggleToaster(toaster)
                    this.props.history.replace('/dashboard/products');
                    this.props.history.push('/dashboard/products');
                }
            }).catch(err => console.log(err))
        })
    }

    onSaveHandler = (event) => {
        this.setState({ prompt: false }, () => {
            event.preventDefault();
            const content = this.state;
            ProductAdd(content).then(res => {
                if (res.status === "success") {
                    const toaster = {
                        isOpenToast: true,
                        toastMessage: res.data.name + " Succesfully Added",
                        toastType: 'success',
                    }
                    this.props.toggleToaster(toaster)

                    toast.success(res.data.name + " Successfully Added");
                    this.props.history.replace('/dashboard/products');
                    this.props.history.push('/dashboard/products');
                }
            }).catch(err => {
                console.log(err);
                toast.warn("Whoops Something Error" + err);
            });
        })

    }

    // Image Processing 
    onDrop = (files, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            toast.error(rejectedFiles.length + " file ditolak karena melebihi ukuran 2MB. Ini akan berdampak pada kecepatan loading yang akan lama jika melebihi dari ukuran tersebut. Kasihan yang pakai koneksi esia hidayah :(")
        }

        this.setState({ saveable: false })
        const max_file_count = 4 - this.state.thumbnailFile.length;
        const array_images = this.state.thumbnailFile.concat(
            files.slice(0, max_file_count).map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            ));

        this.setState({ thumbnailFile: array_images });
        // uploading to cloudinary directly
        files.slice(0, max_file_count).map((file) => {
            this.handleUploadImages(file).then(() => {
                this.setState({ saveable: true })
                this.countFilled();
            });
        })

    }

    // This function does the uploading to cloudinary
    handleUploadImages = (image) => {
        // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()

        // our formdata
        const formData = new FormData();
        formData.append("file", image);
        formData.append("tags", ['product']); // Add tags for the images - {Array}
        formData.append("upload_preset", "blst_product"); // Replace the preset name with your own
        formData.append("api_key", "899241999449336"); // Replace API key with your own Cloudinary API key
        formData.append("folder", "product");
        formData.append("quality", "low");
        formData.append("timestamp", (Date.now() / 1000) | 0);

        // Replace cloudinary upload URL with yours
        return axios.post(
            "https://api.cloudinary.com/v1_1/blstipb2020/image/upload",
            formData,
            { headers: { "X-Requested-With": "XMLHttpRequest" } })
            .then(response => {
                console.log(response.data)
                // const oldImages = this.state.productImagesUrl;
                const newImages = response.data;
                const newArrayofImages = this.state.productImagesUrl.concat(newImages);
                this.setState({ productImagesUrl: newArrayofImages });
            }).catch(err => console.log(err))
    }

    pushFormNotif = (sum) => {
        const notif = [];

        if (this.state.name === '') { notif.push("Nama Produk Belum diisi") };
        if (this.state.category.length === 0) { notif.push("Category belum diisi") };
        if (this.state.author.length === 0) { notif.push("Author belum diisi") };
        if (this.state.productImagesUrl.length === 0) { notif.push("Belum ada Gambar Produk") };
        if (this.state.category.material === 0) { notif.push("Material belum diisi") };
        if (this.state.categoryGeneral.length === 0) { notif.push("Category umum belum diisi") };
        if (this.state.description === '') { notif.push("Deskripsi belum diisi") };
        if (this.state.base_price === 0) { notif.push("Harga Produk belum diisi") };
        if (this.state.pp === 0) { notif.push("Harga Pokok belum diisi") };
        if (this.state.unit === '') { notif.push("Satuan Produk belum diisi") };
        if (this.state.weight === 0) { notif.push("Berat belum diisi") };
        if (this.state.height === 0) { notif.push("Dimensi Panjang Produk belum diisi") };
        // if(this.state.thick !== 0) { notif.push("Tebal Produk belum diisi") };
        if (this.state.isbn === '') { notif.push("ISBN belum diisi") };
        if (this.state.pb === 0) { notif.push("Harga Penerbit belum diisi") };
        if (this.state.royalti_percent === 0) { notif.push("Persen Royalti belum diisi") };
        if (this.state.pages === 0) { notif.push("Halaman belum diisi") };
        if (this.state.manager_proyek === null) { notif.push("Account Manager belum diisi") };
        if (this.state.editor_product === null) { notif.push("Editor Buku belum diisi") };
        if (this.state.layouter_product === null) { notif.push("Layouter Buku belum diisi") };
        if (this.state.desainer_product === null) { notif.push("Desainer Buku belum diisi") };

        this.setState({ formNotFilledYet: notif });
    }

    // Validation
    countFilled = () => {
        // basic
        const title = this.state.name !== '' ? 1 : 0;
        const category = this.state.category.length !== 0 ? 1 : 0;
        const author = this.state.author.length !== 0 ? 1 : 0;
        const productImagesUrl = this.state.productImagesUrl.length !== 0 ? 1 : 0;
        const material = this.state.category.material !== 0 ? 1 : 0;
        const categoryGeneral = this.state.categoryGeneral.length !== 0 ? 1 : 0;
        const description = this.state.description !== '' ? 1 : 0;
        const base_price = this.state.base_price !== 0 ? 1 : 0;
        const pp = this.state.pp !== 0 ? 1 : 0; // pokok penjualan
        const unit = this.state.unit !== '' ? 1 : 0;
        const weight = this.state.weight !== 0 ? 1 : 0;
        const height = this.state.height !== 0 ? 1 : 0;
        // const thick = this.state.thick !== 0 ? 1 : 0;

        // penerbit
        const isbn = this.state.isbn !== '' ? 1 : 0;
        const pb = this.state.pb > 0 ? 1 : 0; // penerbit
        const royalti_percent = this.state.royalti_percent > 0 ? 1 : 0; // penerbit
        const pages = this.state.pages !== 0 ? 1 : 0;
        const manager_proyek = this.state.manager_proyek !== null ? 1 : 0;
        const editor_product = this.state.editor_product !== null ? 1 : 0;
        const layouter_product = this.state.layouter_product !== null ? 1 : 0;
        const desainer_product = this.state.desainer_product !== null ? 1 : 0;



        const sum =
            [title,
                category,
                author,
                productImagesUrl,
                material,
                categoryGeneral,
                description,
                base_price,
                pp,
                weight,
                pages,
                height,
                // thick,
                unit,

                isbn,
                pb,
                royalti_percent,

                manager_proyek,
                editor_product,
                layouter_product,
                desainer_product
            ];

        this.pushFormNotif(sum);

        const sums = sum.reduce((a, b) => a + b, 0);
        const pembagi = sum.length;
        const percent = (sums / pembagi) * 100;

        this.setState({ sumFilled: Math.ceil(percent) })
    }


    deleteImageHandler = (event, index) => {
        event.preventDefault();
        const public_id = this.state.productImagesUrl[index];

        if (typeof public_id !== 'undefined') {
            axios.delete("https://api.cloudinary.com/v1_1/blst/image/upload?public_ids[]=" + public_id.public_id).then(res => {
                console.log(res)
            });
        }

        const del1 = this.state.thumbnailFile.splice(index, 1);
        const del2 = this.state.productImagesUrl.splice(index, 1);
        Promise.all([del1, del2]).then(() => {
        })
        this.setState({ thumbnailFile: this.state.thumbnailFile, productImagesUrl: this.state.productImagesUrl });
    }

    componentWillUnmount() {
        // Make sure to revoke the data uris to avoid memory leaks
        this.state.thumbnailFile.forEach(file => URL.revokeObjectURL(file.preview))
    }

    componentWillMount() {

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        // call for CategoryGeneral
        this.props.setLoading(true)
        const categoryGeneral = [];
        const content = {}
        ProductCategoryGeneral(content).then(res => {
            res.map((value, key) => {
                categoryGeneral.push({
                    id: value.id,
                    value: value.id,
                    label: value.name
                });
            });

        }).then(res => {
            this.setState({ category_general_options: categoryGeneral });
            this.props.setLoading(false)
        }).catch(err =>
            toast.warn("Network Error, Can't get catogory data from server " + err));
        this.props.setLoading(false);

        // call for Category
        const category = [];
        ProductCategory().then(res => {
            res.map((value, key) => {
                category.push({
                    id: value.id,
                    value: value.name,
                    label: value.name
                })
            })
            this.setState({ category_options: category })
        })

        // call for Material
        const materials = [];
        MaterialIndex().then(res => {
            res.map((value, key) => {
                materials.push({
                    id: value.id,
                    value: value.id,
                    label: value.name
                })
            })
            this.setState({ materials: materials })
        });

        // call for author
        const authorsnya = [];
        AuthorIndex().then(res => {
            res.map((value, key) => {
                authorsnya.push({
                    id: value.id,
                    value: value.name,
                    label: value.name
                })
            })
            this.setState({ authors_options: authorsnya })
        });

        // call for employee
        const list_emp = [];
        const push_blst_employee = ListEmployee().then(res => {
            res.map((value, index) => {
                list_emp.push({
                    id: value.id_user,
                    value: value.name,
                    label: value.name
                })
            })
        }).then(() => {
            this.setState({ user_blst: list_emp });
        });




        // if status == edit
        if (this.props.match.params.status === "edit" || this.props.match.params.status === "duplicate") {
            this.setState({ isFetching: true });

            const content = {
                id: this.props.match.params.id
            }
            ProductEdit(content).then(res => { 
                               
                this.setState({ edit_status: this.props.match.params.status });
                const categories = [];
                const authors = [];
                const materials = [];
                const pictures = [];
                const picture_url = [];
                const push_cat = res.Categories.map((value, key) => {
                    categories.push({
                        id: value.id,
                        value: value.id,
                        label: value.name
                    })
                });

                const push_author = res.Authors.map((value, index) => {
                    authors.push({
                        id: value.id,
                        value: value.id,
                        label: value.name
                    })
                });

                const push_material = res.Materials.map((value, index) => {
                    materials.push({
                        id: value.id,
                        value: value.id,
                        label: value.name
                    })
                })

                const push_picture = res.Pictures.map((value, index) => {
                    const file = new File([], value.original_filename, { lastModified: value.updated_at });
                    pictures.push(
                        Object.assign(file, {
                            preview: value.url_medium
                        })
                    )

                    picture_url.push({
                        public_id: value.public_id,
                        alt: value.alt,
                        bytes: value.size,
                        original_filename: value.original_filename,
                        signature: value.signature
                    })

                })

                Promise.all([push_cat, push_author, push_material, push_picture, push_blst_employee]).then(() => {

                    const push_manager = this.state.user_blst.filter((user) => {
                        return new RegExp(res.manager_proyek, "i").exec(user.id);
                    });

                    const push_layouter_product = this.state.user_blst.filter((user) => {
                        return new RegExp(res.layouter_product, "i").exec(user.id);
                    });

                    const push_editor_product = this.state.user_blst.filter((user) => {
                        return new RegExp(res.editor_product, "i").exec(user.id);
                    });

                    const push_desainer_product = this.state.user_blst.filter((user) => {
                        return new RegExp(res.desainer_product, "i").exec(user.id);
                    });


                    if (push_manager[0] !== undefined) {
                        this.setState({ manager_proyek: push_manager[0] });
                        this.setState({ layouter_product: push_layouter_product[0] });
                        this.setState({ editor_product: push_editor_product[0] });
                        this.setState({ desainer_product: push_desainer_product[0] });
                    }

                    this.setState({ category: categories });
                    this.setState({ author: authors });
                    this.setState({ material: materials });
                    this.setState({ thumbnailFile: pictures });
                    this.setState({ productImagesUrl: picture_url });

                    this.setState({
                        name: res.name,
                        categoryGeneral: {
                            id: res.CategoryGeneral.id,
                            label: res.CategoryGeneral.name,
                            value: res.CategoryGeneral.id,
                        },
                        publish_date: res.publish_date,
                        base_price: res.base_price,
                        promo_price: res.promoPrice,
                        description: res.description,
                        weight: res.weight,
                        width: res.width,
                        height: res.height,
                        thick: res.thick,
                        version: res.version,
                        production_version: res.fabrication_version,
                        pages: res.pages,
                        isbn: res.isbn,
                        sku: res.sku,
                        saveable: true,
                        productId: res.id,
                        royalti_percent: res.royalti_percent !== null ? res.royalti_percent : 0,
                        mou_data: res.mou_data !== null ? res.mou_data : new Date(),
                        source_fin_publisher: res.source_fin_publisher !== null ? res.source_fin_publisher : 0,
                        source_fin_author: res.source_fin_author !== null ? res.source_fin_author : 0,
                        source_fin_sponsor: res.source_fin_sponsor !== null ? res.source_fin_sponsor : 0,
                        pp: res.pp !== null ? res.pp : 0,
                        pb: res.pb !== null ? res.pb : 0,

                    }, () => {
                        this.countFilled();
                        this.setState({ isFetching: false });
                    })

                })



            })
        }
    }


    // Handling untuk penambahan category, material, author
    AddButtonHandler = (event) => {
        event.preventDefault();
        const mode = this.state.addMode;

        if (mode === 'category') {
            const content = {
                name: this.state.newCategory.name
            }
            NewCategoryAction(content).then(res => {
                if (res.status === "success") {
                    toast.success("Material Added Successfully");
                    this.hideModal()
                    const addedCategory = {
                        id: res.data.id,
                        value: res.data.id,
                        label: res.data.name
                    }
                    const oldCategory = this.state.category;
                    const newCategory = oldCategory.concat(addedCategory);
                    this.setState({ category: newCategory })
                } else {
                    toast.warning("Error Please Reload");
                }
            }).then((res) => {
                const category = [];
                ProductCategory().then(res => {
                    res.map((value, key) => {
                        category.push({
                            id: value.id,
                            value: value.id,
                            label: value.name
                        })
                    })
                    this.setState({ category_options: category })
                });
            })
        }

        if (mode === 'author') {
            const content = {
                name: this.state.newAuthor.name,
                occupation: this.state.newAuthor.occupation,
                phone: this.state.newAuthor.phone
            }

            AuthorCreate(content).then(res => {
                if (res.status === "success") {
                    toast.success("Author Added Successfully");
                    this.hideModal();

                    const addedAuthor = {
                        id: res.data.id,
                        value: res.data.id,
                        label: res.data.name
                    }

                    const oldAuthor = this.state.author;
                    const newAuthor = oldAuthor.concat(addedAuthor);
                    this.setState({ author: newAuthor })
                } else {
                    toast.warning("Error Please Reload");
                }
            }).then((res) => {
                const authors = [];
                AuthorIndex().then(res => {
                    res.map((value, key) => {
                        authors.push({
                            id: value.id,
                            value: value.id,
                            label: value.name
                        })
                    })
                    console.log(authors)
                    this.setState({ authors_options: authors })
                });
            })
        }

        if (mode === 'material') {
            const content = {
                name: this.state.newMaterial.name,
            }
            MaterialCreate(content).then(res => {
                console.log(res)
                if (res.status === "success") {
                    toast.success("Material Added Successfully");
                    this.hideModal()
                    const addedMaterial = {
                        id: res.data.id,
                        value: res.data.id,
                        label: res.data.name
                    }

                    const oldMaterial = this.state.material;
                    const newMaterial = oldMaterial.concat(addedMaterial);
                    this.setState({ material: newMaterial })
                } else {
                    toast.warning("Error Please Reload");
                }
            }).then((res) => {
                const materials = [];
                MaterialIndex().then(res => {
                    res.map((value, key) => {
                        materials.push({
                            id: value.id,
                            value: value.id,
                            label: value.name
                        })
                    })
                    this.setState({ materials: materials })
                });
            })
        }

    }

    showToaster = (message) => {
        const snackBarOption = {
            isOpen: true,
            text: message
        };
    }

    // fungsi untuk mencari string di array digunakan di logic option
    searchStringInArray = (string, myArray) => {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].label === string) {
                return myArray[i];
            }
        }

    }



    render() {
        let modalform = null;
        let titlemodal = null;
        let status = false;

        let color = 'grey';
        if (this.state.sumFilled < 20) {
            color = '#fb5a5a';
        } else if (this.state.sumFilled < 40) {
            color = '#fbb35a';
        } else if (this.state.sumFilled < 60) {
            color = '#fbe75a';
        } else if (this.state.sumFilled < 80) {
            color = '#5ae5fb';
        } else {
            color = '#5bd400';
        }

        let datatipform = null;
        if (this.state.formNotFilledYet !== null) {
            datatipform = this.state.formNotFilledYet.map((value, index) => (
                <div>{value}</div>
            ))
        }


        if (this.state.addCategory) {
            titlemodal = "Add Category"
            status = this.state.newCategory.name === "";
            modalform =
                <Row>
                    <Col md={12}>
                        <Label for="nasme" required>Category Name <small>/ Nama Kategori</small></Label>
                        <Input value={this.state.newCategory.name} type="text" onChange={(event) => this.setState({ newCategory: { name: event.target.value }, addMode: 'category' })}></Input>
                    </Col>
                </Row>
        }

        if (this.state.addAuthor) {
            titlemodal = "Add Author"
            status = this.state.newAuthor.name === "" || this.state.newAuthor.phone === "";

            modalform =
                <Row>
                    <Col md={12}>
                        <Label for="name" required>Author Name <small>/ Nama Penulis</small></Label>
                        <Input type="text" value={this.state.newAuthor.name} onChange={(event) => {
                            const value = event.target.value;
                            this.setState((prevState) => ({
                                ...prevState,
                                addMode: 'author',
                                newAuthor: {
                                    ...prevState.newAuthor,
                                    name: value
                                }
                            }))
                        }}
                        ></Input>
                        <Label for="name" required>Phone Number <small>/ Nomor Telp</small></Label>
                        <Input type="text"
                            onChange={(event) => {
                                const value = event.target.value;
                                this.setState((prevState) => ({
                                    ...prevState,
                                    addMode: 'author',
                                    newAuthor: {
                                        ...prevState.newAuthor,
                                        phone: value
                                    }
                                }))
                            }}

                        ></Input>
                    </Col>
                </Row>
        }

        if (this.state.addMaterial) {
            titlemodal = "Add Material"
            status = this.state.newMaterial.name === "";
            modalform =
                <Row>
                    <Col md={12}>
                        <Label for="name" required>Material Name <small>/ Nama Bahan</small></Label>
                        <Input type="text" value={this.state.newMaterial.name} onChange={(event) => this.setState({ newMaterial: { name: event.target.value }, addMode: 'material' })}></Input>
                    </Col>
                </Row>
        }        

        return (

            <div className="content">
                {this.state.isFetching ? (<div style={{ width: '100%', height: '85vh' }}>
                    <Spinner></Spinner>
                </div>) : (
                        <div className="progress-bar-class">
                            <ReactTooltip />
                            <span>Filled Percentage <b>{this.state.sumFilled}%</b></span>
                            <Line data-html={true} data-tip={renderToString(datatipform)} percent={this.state.sumFilled} strokeWidth="2" strokeColor={color} />
                        </div>
                    )}
                <Prompt when={this.state.prompt} message="You have unsaved form data. Are you sure you want to leave?" />
                {/* Modal Tambah */}
                <Modal isOpen={this.state.modal} fade={false} toggle={this.hideModal}>
                    <form onSubmit={(event) => this.AddButtonHandler(event)}>
                        <ModalHeader>
                            {titlemodal}
                        </ModalHeader>
                        <ModalBody>
                            {modalform}
                            {status ? <Button disabled size="sm">Add</Button> : <Button onClick={(event) => this.AddButtonHandler(event)} size="sm">Add</Button>}
                        </ModalBody>
                    </form>
                </Modal>
                <form>
                    <Row>
                        <Col md={4} xs={12}>
                            <Card className="card-user">
                                <CardHeader>
                                    <h6>Display Photos <small>Max 4</small></h6>
                                </CardHeader>
                                <CardBody>
                                    <ImageUploader onDrop={this.onDrop} deleted={this.deleteImageHandler} filepreview={this.state.thumbnailFile} maxUpload={4} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={8} xs={12}>
                            {/* General Information */}
                            <Card className="card-user">
                                <CardHeader>
                                    <h6>Product Information</h6>
                                </CardHeader>
                                <CardBody>
                                    <Col md={12}>
                                        <Label for="name" required>Product Name <small>/ Nama Produk</small></Label>
                                        <Input type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value }, () => { this.countFilled() })}></Input>
                                    </Col>
                                    <Col md={12}>
                                        <ReactTooltip />
                                        <Label for="name" required>Product Category <small data-tip="Hubungi tim IT untuk menambahan data jika tidak tersedia">/ Kategori Umum</small></Label>
                                        <Select
                                            onChange={(val) => this.setState({ categoryGeneral: val }, () => { this.countFilled() })}
                                            name="categoryGeneral"
                                            value={this.state.categoryGeneral}
                                            className="basic-multi-select"
                                            options={this.state.category_general_options}
                                        />
                                    </Col>
                                    <Col md={12}>
                                        <Label for="name" required>Category <small>/ Kategori</small></Label>
                                        {this.state.show_button_cat.condition ? (
                                            <Button onClick={this.newFormHandler} name="addCategory" color="primary" size="sm">
                                                <i className="nc-icon nc-simple-add"></i> New Category
                                            </Button>) : null
                                        }
                                        <Select
                                            onChange={(val) => this.setState({ category: val }, () => { this.countFilled() })}
                                            onInputChange={(inputValue, apa, ini) => {
                                                let initNumber = [];
                                                this.state.category_options.filter((category) => {
                                                    const isExists = new RegExp(inputValue, "i")
                                                        .exec(category.label);
                                                    if (isExists !== null) {
                                                        initNumber.push(1);
                                                    }
                                                })

                                                if (initNumber.length === 0) {
                                                    this.setState({ show_button_cat: { condition: true }, newCategory: { name: inputValue }, addMode: "category" })
                                                } else if (initNumber.length === this.state.category_options.length) {
                                                    setTimeout(() => { this.setState({ show_button_cat: { condition: false } }) }, 800)
                                                }
                                                else {
                                                    this.setState({ show_button_cat: { condition: false }, newCategory: { name: inputValue } })
                                                }
                                            }}
                                            isMulti
                                            name="category"
                                            placeholder="type here..."
                                            value={this.state.category}
                                            className="basic-multi-select"
                                            values={this.state.category}
                                            options={this.state.category_options}
                                        />

                                    </Col>
                                    <Col md={12}>
                                        <Label for="name" required>Author <small>/ Penulis</small></Label>
                                        {this.state.show_button_author.condition ? (
                                            <Button onClick={this.newFormHandler} color="primary" size="sm" name="addAuthor">
                                                <i className="nc-icon nc-simple-add"></i> New Author
                                            </Button>
                                        ) : null}

                                        <Select
                                            onChange={(val) => this.setState({ author: val }, () => { this.countFilled() })}
                                            onInputChange={(inputValue, apa, ini) => {
                                                let initNumber = [];
                                                this.state.authors_options.filter((author) => {
                                                    const isExists = new RegExp(inputValue, "i")
                                                        .exec(author.label);
                                                    if (isExists !== null) {
                                                        initNumber.push(1);
                                                    }
                                                })

                                                if (initNumber.length === 0) {
                                                    this.setState((prevState) => ({
                                                        ...prevState,
                                                        show_button_author: { condition: true },
                                                        addMode: "author",
                                                        newAuthor: { ...prevState.newAuthor, name: inputValue }
                                                    })
                                                    )
                                                } else if (initNumber.length === this.state.authors_options.length) {
                                                    setTimeout(() => { this.setState({ show_button_author: { condition: false } }) }, 800)
                                                }
                                                else {
                                                    this.setState(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            show_button_author: { condition: false },
                                                            addMode: "author",
                                                            newAuthor: { ...prevState.newAuthor, name: inputValue }
                                                        })
                                                        // { show_button_author: { condition: false }, newAuthor: { name: inputValue } }

                                                    )
                                                }
                                            }}

                                            isMulti
                                            value={this.state.author}
                                            name="author"
                                            className="basic-multi-select"
                                            options={this.state.authors_options}
                                        />

                                    </Col>
                                    <Col md={6}>
                                        <Label for="date_publish" required>Published Date <small>/ Tanggal Terbit</small></Label>
                                        <DatePicker
                                            className="form-control"
                                            selected={new Date(this.state.publish_date)}
                                            dateFormat="dd-MM-yyyy"
                                            onChange={(val) => this.setState({ publish_date: val })}
                                        />
                                    </Col>
                                </CardBody>
                                <CardFooter>

                                </CardFooter>
                            </Card>
                            <Card className="card-user">
                                <CardHeader>
                                    <h6>Price <small>/ Harga</small></h6>
                                </CardHeader>
                                <CardBody style={{ minHeight: "0" }}>
                                    <Row>
                                        <Col md={7}>
                                            <Label for="name" required><strong>Price</strong><small>/ Harga Jual Dasar</small></Label>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>Rp</InputGroupText>
                                                </InputGroupAddon>
                                                <Input style={{ fontWeight: '700', fontSize: '20pt' }}
                                                    type="text"
                                                    value={this.formatuang(this.state.base_price)}
                                                    name="base_price"
                                                    onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                </Input>
                                            </InputGroup>
                                        </Col>
                                        <Col md={5}>
                                            <Label for="name" required><strong>Unit Name</strong><small>/ Per Product</small></Label>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">/</InputGroupAddon>
                                                <Input style={{ fontWeight: '700', fontSize: '20pt' }}
                                                    type="text"
                                                    value={this.state.unit}
                                                    name="unit"
                                                    onChange={(event) => { this.setState({ unit: event.target.value }) }}>
                                                </Input>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={7}>
                                            <Label for="name" required><strong>Promo Price</strong><small>/ Harga Promo</small></Label>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>Rp</InputGroupText>
                                                </InputGroupAddon>
                                                <Input style={{ fontWeight: '700', fontSize: '20pt' }}
                                                    type="text"
                                                    value={this.state.promo_price !== 0 ? this.formatuang(this.state.promo_price) : this.formatuang(this.state.base_price)}
                                                    name="promo_price"
                                                    onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                </Input>
                                            </InputGroup>
                                        </Col>
                                        <Col md={5}>
                                            <Label for="name" required><strong>Perhatian: </strong></Label>
                                            <Label for="name"><small>Harga promo harus diisi, jika harga tidak ada diskon, maka isi nilainya sama dengan Price atau Harga Jual Dasar</small></Label>
                                        </Col>
                                    </Row>

                                    {this.state.categoryGeneral.label === "Book" ? (
                                        <Row>
                                            <Col md={6}>
                                                <Label for="date_publish" required>HPP <br></br> <small>Harga Pokok Penjualan</small></Label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>Rp</InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        type="text"
                                                        value={this.formatuang(this.state.pp)}
                                                        name="pp"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>
                                                </InputGroup>
                                            </Col>
                                            <Col md={6}>
                                                <Label for="date_publish" required>Persentase Royalti <br></br> <small>Royalti % x Harga Jual</small></Label>
                                                <InputGroup>
                                                    <Input
                                                        type="text"
                                                        style={{ textAlign: 'center' }}
                                                        value={this.formatuang(this.state.royalti_percent)}
                                                        name="royalti_percent"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText>%</InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    ) : null}
                                    {/* <Row>
                        <Col md={6}>
                            <Label for="name" required>Production Price <small>/ HPP</small></Label>                        
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    type="text" 
                                    value={this.formatuang(this.state.create_price)} 
                                    name="create_price"                             
                                    onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                </Input>
                            </InputGroup>
                        </Col>  
                        <Col md={6}>
                            <Label for="name" required>Release Price <small>/ Harga Terbit</small></Label>                        
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                        <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    type="text" 
                                    value={this.formatuang(this.state.published_price)} 
                                    name="published_price"                             
                                    onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                </Input>
                            </InputGroup>                            
                        </Col>                                                            
                    </Row> */}
                                </CardBody>
                            </Card>
                            <Card className="card-user">
                                <CardHeader>
                                    <h6>Product Detail <small>/ Detail Produk</small></h6>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md={12}>
                                            <Label for="name" required>Description<small>/ Deskripsi</small><small style={{ float: 'right' }}>{500 - this.state.description.length} / 500</small></Label>
                                            <Input style={{ padding: '10px' }}
                                                type="textarea"
                                                value={this.state.description}
                                                onChange={(event) => this.setState({ description: event.target.value }, () => { this.countFilled() })}
                                                name="description"
                                                rows="10"
                                                cols="30">
                                            </Input>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Label required> Material</Label>
                                            {this.state.show_button_material.condition ? (
                                                <Button onClick={this.newFormHandler} name="addMaterial" color="primary" size="sm">
                                                    <i className="nc-icon nc-simple-add"></i> New Material</Button>
                                            ) : null}

                                            <Select
                                                onChange={(val) => this.setState({ material: val })}
                                                onInputChange={(inputValue, apa, ini) => {
                                                    let initNumber = [];
                                                    this.state.materials.filter((material) => {
                                                        const isExists = new RegExp(inputValue, "i")
                                                            .exec(material.label);
                                                        if (isExists !== null) {
                                                            initNumber.push(1);
                                                        }
                                                    })

                                                    if (initNumber.length === 0) {
                                                        this.setState({ show_button_material: { condition: true }, newMaterial: { name: inputValue }, addMode: "material" })
                                                    } else if (initNumber.length === this.state.materials.length) {
                                                        setTimeout(() => { this.setState({ show_button_material: { condition: false } }) }, 800)
                                                    }
                                                    else {
                                                        this.setState({ show_button_material: { condition: false }, newMaterial: { name: inputValue } })
                                                    }
                                                }}

                                                isMulti
                                                value={this.state.material}
                                                name="material"
                                                className="basic-multi-select"
                                                options={this.state.materials}
                                            />

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Label for="name" required>Weight <small>/ Berat</small></Label>
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    value={this.formatuang(this.state.weight)}
                                                    name="weight"
                                                    onChange={(event) => this.onChangeNumberHandler(event)}>
                                                </Input>
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>gram</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Col>
                                        <Col md={4}>
                                            <Label for="name" required>Width <small>/ Lebar</small></Label>
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    value={this.state.width}
                                                    name="width"
                                                    onChange={(event) => this.onChangeNumberHandler(event)}>
                                                </Input>
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>cm</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Col>
                                        <Col md={4}>
                                            <Label for="name" required>Height <small>/ Tinggi</small></Label>
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    value={this.state.height}
                                                    name="height"
                                                    onChange={(event) => this.onChangeNumberHandler(event)}>
                                                </Input>
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>cm</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Col>
                                        {/* <Col md={3}>
                                            <Label for="name" required>Thick <small>/ Tebal</small></Label>                        
                                            <InputGroup>                                    
                                                <Input 
                                                    type="text" 
                                                    value={this.formatuang(this.state.thick)} 
                                                    name="thick"                             
                                                    onChange={(event)=> this.onChangeNumberHandler(event)}>
                                                </Input>
                                                <InputGroupAddon addonType="append">
                                                        <InputGroupText>cm</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>   
                                            </Col> */}
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Label for="name">Code <small>/ Kode Produk</small></Label>
                                            <Input value={this.state.sku} type="text" name="sku" onChange={(event) => this.setState({ sku: event.target.value }, () => { this.countFilled() })}></Input>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            {this.state.categoryGeneral.label === "Book" ? (
                                <>
                                    <Card className="card-user">
                                        <CardHeader>
                                            <h6>Book Detail <small>/ Detail Buku</small></h6>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md={4}>
                                                    <Label for="name">Product Edition <small>/ Edisi Buku</small></Label>

                                                    <Input
                                                        type="text"
                                                        value={this.formatuang(this.state.version)}
                                                        name="version"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>

                                                </Col>
                                                <Col md={4}>
                                                    <Label for="name">Print Version <small>/ Cetakan ke</small></Label>

                                                    <Input
                                                        type="text"
                                                        value={this.formatuang(this.state.production_version)}
                                                        name="production_version"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>

                                                </Col>
                                                <Col md={4}>
                                                    <Label required for="name">Jumlah <small> Halaman</small></Label>

                                                    <Input
                                                        type="text"
                                                        value={this.formatuang(this.state.pages)}
                                                        name="pages"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>

                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>
                                                    <Label required> ISBN</Label>
                                                    <Input
                                                        type="text"
                                                        value={this.state.isbn}
                                                        name="isbn"
                                                        onChange={(event) => this.setState({ isbn: event.target.value }, () => { this.countFilled() })}>
                                                    </Input>
                                                </Col>
                                            </Row>

                                            {/* <Row>
                                        <Col md={12}>
                                            <Label> Tim Penulis</Label>
                                            <Input
                                                type="text"
                                                value={this.state.tim_penulis}
                                                name="tim_penulis"
                                                onChange={(event) => this.setState({ tim_penulis: event.target.value }, () => { this.countFilled() })}>
                                            </Input>
                                        </Col>
                                    </Row> */}

                                            <Row>
                                                <Col md={4}>
                                                    <Label for="mou_data" required>MoU End Date</Label>
                                                    <DatePicker
                                                        className="form-control"
                                                        selected={new Date(this.state.mou_data)}
                                                        dateFormat="dd-MM-yyyy"
                                                        onChange={(val) => this.setState({ mou_data: val })}
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Label for="name" required>Harga Cetak <small>/ Hpp</small></Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>Rp</InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            type="text"
                                                            value={this.formatuang(this.state.pp)}
                                                            name="pp"
                                                            onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                        </Input>
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <Label for="pb" required>Harga Terbit</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>Rp</InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            type="text"
                                                            value={this.formatuang(this.state.pb)}
                                                            name="pb"
                                                            onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                        </Input>
                                                    </InputGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={4}>
                                                    <Label for="name" required>Product Edition <small>/ Edisi Buku</small></Label>

                                                    <Input
                                                        type="text"
                                                        value={this.formatuang(this.state.version)}
                                                        name="version"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>

                                                </Col>
                                                <Col md={4}>
                                                    <Label for="name" required>Print Version <small>/ Cetakan ke</small></Label>

                                                    <Input
                                                        type="text"
                                                        value={this.formatuang(this.state.production_version)}
                                                        name="production_version"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>

                                                </Col>
                                                <Col md={4}>
                                                    <Label for="name">Product Pages <small>/ Total Halaman</small></Label>

                                                    <Input
                                                        type="text"
                                                        value={this.formatuang(this.state.pages)}
                                                        name="pages"
                                                        onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                    </Input>

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <h6>Persentase Sumber Dana</h6>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md={4}>
                                                    <Label for="name">Penerbit</Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="text"
                                                            value={this.formatuang(this.state.source_fin_publisher)}
                                                            name="source_fin_publisher"
                                                            onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                        </Input>
                                                        <InputGroupAddon addonType="append">
                                                            <InputGroupText>%</InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>

                                                </Col>
                                                <Col md={4}>
                                                    <Label for="name">Penulis</Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="text"
                                                            value={this.formatuang(this.state.source_fin_author)}
                                                            name="source_fin_author"
                                                            onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                        </Input>
                                                        <InputGroupAddon addonType="append">
                                                            <InputGroupText>%</InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <Label for="name">Project</Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="text"
                                                            value={this.formatuang(this.state.source_fin_sponsor)}
                                                            name="source_fin_sponsor"
                                                            onChange={(event) => this.onChangeMoneyHandler(event)}>
                                                        </Input>
                                                        <InputGroupAddon addonType="append">
                                                            <InputGroupText>%</InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <h6>Product Manager</h6>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md={12}>
                                                    <Label for="layouter" required>Manager Product / PIC</Label>
                                                    <Select
                                                        onChange={(val) => this.setState({ manager_proyek: val }, () => { this.countFilled() })}
                                                        name="manager_proyek"
                                                        value={this.state.manager_proyek}
                                                        className="basic-multi-select"
                                                        options={this.state.user_blst}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <Label for="editor" required>Editor</Label>
                                                    <Select
                                                        onChange={(val) => this.setState({ editor_product: val }, () => { this.countFilled() })}
                                                        name="editor_product"
                                                        value={this.state.editor_product}
                                                        className="basic-multi-select"
                                                        options={this.state.user_blst}
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Label for="layouter" required>Layouter</Label>
                                                    <Select
                                                        onChange={(val) => this.setState({ layouter_product: val }, () => { this.countFilled() })}
                                                        name="layouter_product"
                                                        value={this.state.layouter_product}
                                                        className="basic-multi-select"
                                                        options={this.state.user_blst}
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Label for="layouter" required>Desainer</Label>
                                                    <Select
                                                        onChange={(val) => this.setState({ desainer_product: val }, () => { this.countFilled() })}
                                                        name="desainer_product"
                                                        value={this.state.desainer_product}
                                                        className="basic-multi-select"
                                                        options={this.state.user_blst}
                                                    />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </>
                            ) : null}


                            <Row >
                                <Col md={12} style={{ textAlign: 'right' }}>
                                    {this.state.saveable && this.state.sumFilled > 60 && this.state.thumbnailFile.length > 0 ? (
                                        <div>
                                            <Button onClick={(event) => this.props.history.push('/dashboard/products')} color="secondary">Cancel</Button>
                                            {/* <Button color="secondary" >Save & Add New</Button>
                        <Button color="secondary" >Copy & Add New</Button>                         */}
                                            {this.state.edit_status !== "edit" ? (<Button onClick={this.onSaveHandler} color="success" >Save</Button>) : (<Button onClick={this.onUpdateHandler} color="success" >Update</Button>)}
                                        </div>
                                    ) : (
                                            <div>
                                                <Loader text="Waiting for you" />
                                            </div>
                                        )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </form>
                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ui: state.ui
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleNotif: (message) => dispatch(actionCreator.toggleNotification(message)),
        setLoading: (data) => dispatch(actionCreator.toggleLoading(data)),
        toggleToaster: (payload) => dispatch(actionCreator.toggleToaster(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductEditor);
