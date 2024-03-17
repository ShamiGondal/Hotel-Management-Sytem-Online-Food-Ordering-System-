import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const handleClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    return (
        <Pagination>
            {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item key={number + 1} onClick={() => handleClick(number + 1)} active={number + 1 === currentPage}>
                    {number + 1}
                </Pagination.Item>
            ))}
        </Pagination>
    );
};

export default PaginationComponent;
