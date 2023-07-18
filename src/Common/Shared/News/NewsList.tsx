import { useEffect, useState, useMemo } from "react";
import {GetAllNewsForUsers, GetAllNewsForUsersPage} from "../../../services/newsService";
import Modal from "react-modal";
import MyTable from "../Form/MyTable";
import { GetAttribute, GetAttributeValues } from "../../../services/attributeService";
import { SetProduct } from "../../../services/productService";
import { useNavigate } from "react-router-dom";
import {optionsRole} from "../../Enums/RolesEnums";
import QueryString from "qs";
import {GetDataWithSearch} from "../../../services/userService";

const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '5%',
        border: '2px ridge black'
    }
};
const NewsList:React.FC = () => {
    const [PageNumber, setPageNumber] = useState( getPage().PageNumber?getPage().PageNumber:0)
    const [PageSize, setPageSize] = useState(getPage().PageSize?getPage().PageSize:10)
    const [totalCount , setTotalCount]=useState(0) ;
    const [guessNews, setGuessNews] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    const navigate = useNavigate()
    const [modalIsOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(0)
    const openModal = (id:number) => {
        setIsOpen(true);
        setId(id)

    }
    const param = { PageSize , PageNumber}

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items? items:''


    }
    const getBulkJob = (selected:number) => {
        if (selected === 2) {
            enableSelectedItem()
        }
        if (selected === 3) {
            copySelectedItem()
        }
        if (selected === 5) {
            disableSelectedItem()
        }
    }
    const disableSelectedItem = async () => {


    }
    const copySelectedItem = async () => {



    }
    const enableSelectedItem = async () => {



    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const getDataByPage = async () => {


        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {


                PageNumber,
                PageSize


            }
            ,
            paramsSerializer:(params:any)=>{

                return QueryString.stringify(params)
            }

        };
        const { data, status } = await GetAllNewsForUsersPage(config);
        setGuessNews(data.result.news.values)
        sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

    }
    const getNews = async () => {
        try {
            const { data, status } = await GetAllNewsForUsers();
            setGuessNews(data.result.news.values)
        } catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        getNews()
    }, [])
    const ShowHandler = (id:any) => {
        navigate(`/admin/news/${id}`)
    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'عنوان', accessor: 'title' }

        , { Header: 'تاریخ', accessor: ' ', Cell: (row:any) => (new Date(row.row.original.createDate).toLocaleTimeString('fa-IR')) }

        , {
            Header: 'عملیات', accessor: '', Cell: (row:any) => (<button onClick={() => openModal(row.row.original.id)} className="border-0 bg-transparent non-hover edit-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye"
                     viewBox="0 0 16 16">
                    <path
                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg> </button>)
        }],[])
    const data = useMemo(() => guessNews,[guessNews]);
    if (data) {
        return (
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>


                    </div>
                </div>

                <div className=" statbox widget-content widget-content-area">
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Selected Option"
                        ariaHideApp={false}

                    >
                        <div style={{width:"20rem"}}>
                            <div className="d-block clearfix mb-2"   onClick={closeModal}><svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24"
                                viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-x close"
                                data-dismiss="alert"><line x1="18" y1="6"
                                                           x2="6"
                                                           y2="18"></line><line
                                x1="6" y1="6" x2="18" y2="18"></line></svg></div>
                            {guessNews.filter((item:any) => item.id === id).map((item:any) =>
                                <div className='row' key={item.id}>
                                    <span className="col-6">عنوان :{item.title}</span>
                                    <span className="col-6  " style={{ textAlign: "end" }}>{new Date(item.createDate).toLocaleDateString('fa-IR')}</span>
                                    <hr className='col-11' style={{ height: '1px ', background: "black" }} />
                                    <p className="col-12">{item.message}</p>
                                </div>



                            )}


                        </div>
                    </Modal>
                    <div>
                        <MyTable bulkJob={getBulkJob} setPageNumber={setPageNumber} setPageSize={setPageSize}  PageSize={PageSize} total={totalCount} PageNumber={PageNumber} columns={columns} data={data} getData={(rows:any) => setSelectedRows(rows)} getDataBySearch={getDataByPage} />

                    </div>

                </div>
            </div>
        )
    }

    else {
        return (
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area">
                    <div>









                    </div>
                </div>

                <div className='text-center mt-5'>
                    <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                </div>
            </div>
        )
    }
}
export default NewsList