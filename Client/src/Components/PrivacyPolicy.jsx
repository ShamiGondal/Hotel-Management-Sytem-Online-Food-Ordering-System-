import { Container, Row, Col } from 'react-bootstrap';
import { useDarkMode } from './Hooks/DarkModeContext';

const PrivacyPolicy = () => {
    const { isDarkMode } = useDarkMode();

    return (
        <Container className="mt-5 pt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className={`p-5 container bg-${isDarkMode ? 'dark' : 'light'} rounded-3 shadow ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                        <h2 className="text-center mb-4">Privacy Policy</h2>
                        <h4>Introduction</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non mattis lacinia. Nulla facilisi. Cras venenatis faucibus magna, quis tempor eros commodo sit amet.</p>
                        
                        <h4>Collection of Personal Information</h4>
                        <p>Etiam fermentum, arcu nec auctor gravida, libero est fermentum leo, vel aliquam tellus mi id risus. Nulla facilisi. Cras venenatis faucibus magna, quis tempor eros commodo sit amet.</p>

                        <h4>Use of Personal Information</h4>
                        <p>Proin ac eros vestibulum, dapibus velit vel, eleifend sem. Duis efficitur fringilla felis, in luctus neque. Duis aliquet id quam id congue.</p>

                        <h4>Security of Personal Information</h4>
                        <p>Praesent sit amet tellus lectus. Nam malesuada nisi id turpis aliquet, nec ultricies orci sodales. Donec in ligula nec erat hendrerit elementum.</p>

                        <h4>Changes to This Privacy Policy</h4>
                        <p>Sed efficitur, sem non viverra commodo, metus lacus varius est, vel hendrerit libero nisi nec turpis. Nullam ac commodo velit, id pulvinar nunc.</p>

                        <h4>Contact Us</h4>
                        <p>For any questions or concerns regarding our privacy policy, please contact us at privacy@example.com.</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PrivacyPolicy;
