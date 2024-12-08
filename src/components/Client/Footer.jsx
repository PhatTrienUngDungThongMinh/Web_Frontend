import footer1 from '../../assets/client/footer1.png'
import footer2 from '../../assets/client/footer2.jpg'

const Footer = () => {
    return (
        <div className='w-full px-4 '>
            <div className="bg-white py-8 mx-auto max-w-full lg:max-w-[1170px] h-[400px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 leading-[2] text-[14px]">
                    {/* Column 1 */}
                    <div className=''>
                        <h3 className="font-bold">Tư Vấn Và Đặt Hàng</h3>
                        <ul className='opacity-70'>
                            <li>Phương thức thanh toán</li>
                            <li>Hướng dẫn đặt hàng</li>
                            <li>Góp ý, khiếu nại</li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className=''>
                        <h3 className="font-bold">Chính Sách</h3>
                        <ul className='opacity-70'>
                            <li>Chính sách bảo hành</li>
                            <li>Chính sách đổi trả</li>
                            <li>Chính sách giao hàng</li>
                            <li>Chính sách khui hộp</li>
                            <li>Chính sách bảo vệ dữ liệu</li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className=''>
                        <h3 className="font-bold">Tra Cứu Thông Tin</h3>
                        <ul className='opacity-70'>
                            <li>Tra cứu hóa đơn điện tử</li>
                            <li>Tra cứu ưu đãi của bạn</li>
                            <li>Trung tâm bảo hành</li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className=''>
                        <h3 className="font-bold">Hệ Thống</h3>
                        <ul className='opacity-70'>
                            <li>Quy chế hoạt động website</li>
                            <li>Siêu thị gần nhất</li>
                            <li>Chuyên trang Cộng tác viên</li>
                        </ul>
                    </div>

                    {/* Column 5 */}
                    <div className=''>
                        <h3 className="font-bold">Tổng đài hỗ trợ (24/24)</h3>
                        <ul className='opacity-70'>
                            <li>Tư vấn bán hàng: <strong>1800 8123</strong> (Miễn phí)</li>
                            <li>CSKH & bảo hành: <strong>1900 8096</strong></li>
                            <li>Tư vấn bán hàng Doanh nghiệp: <strong>02466599666</strong></li>
                        </ul>
                        <div className='flex flex-wrap mt-4 space-x-2'>
                            <img src={footer1} alt="footer1" className='w-[100px] h-auto' />
                            <img src={footer1} alt="footer1" className='w-[100px] h-auto' />
                        </div>
                        <div className='mt-2'>
                            <img src={footer2} alt="footer2" className='w-full max-w-[213.6px]' />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 py-4 mt-8 opacity-70">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-[13px]">
                        <div>
                            <p>Điện thoại – Điện thoại iPhone – iPhone 16 <br />
                                iPhone 16 Pro – iPhone 16 Pro Max – iPhone 16 Plus
                            </p>
                        </div>

                        <div>
                            <p>Điện thoại Samsung – Điện thoại Vivo – Điện thoại OPPO <br />
                                Samsung Galaxy S24 Ultra – Samsung Galaxy Z Flip6 | Z Fold6
                            </p>
                        </div>

                        <div>
                            <p>Laptop – Máy tính bảng – Đồng hồ thông minh <br />
                                Phụ kiện – Tivi – Gia dụng – Sim số đẹp
                            </p>
                        </div>
                    </div>
                </div>

                <div className="py-4 mt-4">
                    <div className="text-center text-[13px] opacity-70">
                        <p>© 2018 Công ty TNHH Nhà nước Một thành viên Thương mại và Xuất nhập khẩu Viettel. Đăng ký doanh nghiệp số 0104831030, do Sở Kế hoạch và Đầu tư Hà Nội cấp lần đầu ngày 25/01/2006, 
                        thay đổi lần thứ 39 ngày 27 tháng 8 năm 2021. Địa chỉ: Số 01, Phố Giang Văn Minh, phường Kim Mã, quận Ba Đình, Thành phố Hà Nội. Chịu trách nhiệm nội dung: Đinh Sơn Tùng.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
