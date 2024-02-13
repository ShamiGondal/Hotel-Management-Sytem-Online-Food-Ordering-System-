import React from 'react';
import { useDarkMode } from './Hooks/DarkModeContext';

const PrivacyPolicy = () => {

    const {isDarkMode} = useDarkMode();

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }
    return (
        <div className=" mt-5 pt-5 mb-4">
            <div className={`container privacy-policy  mt-5 p-5  bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}  `}>
            <h1 className="privacy-policy__title ">Privacy Policy</h1>
            <div className="privacy-policy__content">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Duis auctor dui non neque
                    fermentum, nec scelerisque metus rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et
                    ultrices posuere cubilia curae; Fusce vel magna mauris. Integer eget eros ligula. Curabitur dictum
                    metus id nisl consequat dictum. Sed fermentum eleifend sapien ut posuere. Quisque euismod mi eu orci
                    convallis, sed scelerisque nulla tincidunt. In hac habitasse platea dictumst. Sed vehicula interdum
                    risus, eu aliquet velit venenatis non. Sed tempus, libero ut vestibulum congue, mauris nunc ultrices
                    ipsum, et ullamcorper odio sapien vel est. Nulla nec felis dapibus, dapibus lacus nec, elementum
                    ipsum. Vestibulum ac dui eu nisl ultricies suscipit.
                </p>
                <p>
                    Quisque id commodo enim. Phasellus finibus turpis sit amet luctus ullamcorper. Suspendisse nec felis
                    vel mi mollis consectetur. Curabitur nec tincidunt ligula. Donec nec semper arcu. Nulla nec nunc sit
                    amet magna ultrices vehicula. Proin sed nisl faucibus, varius lorem a, dignissim tortor. Maecenas ut
                    vestibulum eros. Sed eget est vel purus faucibus posuere in in metus. Cras nec tortor vel justo
                    posuere placerat. Ut eu lacus id mauris tincidunt ultrices nec nec enim. Maecenas egestas aliquam
                    lectus, nec ultricies mi posuere at. Duis quis turpis nec nulla placerat convallis. Fusce non diam a
                    metus fermentum interdum.
                </p>
            </div>
        </div>
        </div>
    );
};

export default PrivacyPolicy;
