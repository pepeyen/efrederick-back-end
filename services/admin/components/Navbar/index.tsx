import {
	useEffect,
	useState
} from "react";
import { useRouter } from "next/dist/client/router";

//Types
import { ISystemStatusResponse } from "../../interfaces/endpoint";

//Services
import {
	getCookie,
	renderConfirmBox,
	fetchFromAPI
} from "../../services";

//Components
import { Loader } from "..";

//Styles
import {
	NavbarWrapper,
	NavbarLogo,
	NavbarItems,
	NavbarItem,
	NavbarRedirectors,
	NavbarRedirector,
	NavbarNavigationItems,
	NavigationButton,
	NavbarHambuerguerButton
} from "./style";

const Navbar = () => {
	const router = useRouter();
	const [
		  	  isNavbarVisible,
		  	  setIsNavbarVisible
		  ] = useState<boolean>(true),
		  [userName, setUserName] = useState(""),
		  [isLoading, setIsLoading] = useState<Boolean>(true),
		  [tableList, setTableList] = useState<string[]>([]);

	const navbarVisibilityHandler = () => {
		setIsNavbarVisible(!isNavbarVisible);
	};

	const handleWindowSizeChange = () => {
        if(window.innerWidth >= 801 && isNavbarVisible === false){
			setIsNavbarVisible(true);
		};
	};

	const generateNavbarLogo = (userName: string): string => {
		let navbarLogo: string = "-";

		if(userName.replace(/\s/g, '').length){
			navbarLogo = userName[0].toUpperCase();
		};

		return navbarLogo;
	};

	const logoutButtonHandler = () => {
		renderConfirmBox(
			document.body,
			"Are you sure you want to leave this realm ?",
			"Yes",
			(() => router.push("http://localhost:9005/admin/service/auth/logout")),
			true,
			"Never Mind"
		);
	};

	const updateTableList = async () => {
		setIsLoading(true);

		fetchFromAPI("status?realm=database")
		.then((databaseData: ISystemStatusResponse) => {
			if(databaseData.status.database){
				setTableList(databaseData.status.database.tableList);
			}else{
				setTableList([]);
			};

			setIsLoading(false);
		})
		.catch(error => {
			console.error(error);
		})
	};

	useEffect(() => {
		setUserName(getCookie("logged_user"));

		updateTableList();
	}, []);

	useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    });

	return(
		<NavbarWrapper data-is-nav-hidden={isNavbarVisible ? undefined : true}>
			<NavbarItems className="--flex-column --flex-centered">
				<NavbarItem>
					<NavbarLogo className="--flex-row --flex-centered-items --squircle-borders">
						{generateNavbarLogo(userName)}
					</NavbarLogo>
				</NavbarItem>
				<NavbarItem className="--flex-spand">
					<NavbarRedirectors className="--flex-column --flex-centered --squircle-borders">
						{
							isLoading ? 
							<Loader />
							:
							tableList.map((table, index) => {
								return (
									<NavbarRedirector
										key={index}
										className="--flex-row --flex-centered"
									>
										<svg
                	        			    xmlns="http://www.w3.org/2000/svg"
                	        			    viewBox="0 0 24 24"
                	        			>
                	        			    <path d="m21.5 23h-19c-1.378 0-2.5-1.122-2.5-2.5v-17c0-1.378 1.122-2.5 2.5-2.5h19c1.378 0 2.5 1.122 2.5 2.5v17c0 1.378-1.122 2.5-2.5 2.5zm-19-21c-.827
											 0-1.5.673-1.5 1.5v17c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-17c0-.827-.673-1.5-1.5-1.5z"/>
											<path d="m23.5 8h-23c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h23c.276 0 .5.224.5.5s-.224.5-.5.5z"/>
											<path d="m23.5 13h-23c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h23c.276 0 .5.224.5.5s-.224.5-.5.5z"/>
											<path d="m23.5 18h-23c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h23c.276 0 .5.224.5.5s-.224.5-.5.5z"/>
											<path d="m6.5 23c-.276 0-.5-.224-.5-.5v-15c0-.276.224-.5.5-.5s.5.224.5.5v15c0 .276-.224.5-.5.5z"/>
											<path d="m12 23c-.276 0-.5-.224-.5-.5v-15c0-.276.224-.5.5-.5s.5.224.5.5v15c0 .276-.224.5-.5.5z"/>
											<path d="m17.5 23c-.276 0-.5-.224-.5-.5v-15c0-.276.224-.5.5-.5s.5.224.5.5v15c0 .276-.224.5-.5.5z"/>
										</svg>
										<span>{table}</span>
									</NavbarRedirector>
								);
							})
						}
					</NavbarRedirectors>
				</NavbarItem>
				<NavbarItem className="--align-bottom">
					<NavbarNavigationItems>
						<NavigationButton
							title="Home"
							onClick={(() => router.push("http://localhost:9005/admin/dashboard"))}
						>
            			    <svg
            			        xmlns="http://www.w3.org/2000/svg"
            			        viewBox="0 1 511 511.999"
            			    >
            			        <path d="m498.699219 222.695312c-.015625-.011718-.027344-.027343-.039063-.039062l-208.855468-208.847656c-8.902344-8.90625-20.738282-13.808594-33.328126-13.808594-12.589843 0-24.425781 4.902344-33.332031 13.808594l-208.746093 208.742187c-.070313.070313-.144532.144531-.210938.214844-18.28125 18.386719-18.25 48.21875.089844 66.558594 8.378906 8.382812 19.441406 13.234375 31.273437 13.746093.484375.046876.96875.070313 1.457031.070313h8.320313v153.695313c0 30.417968 24.75 55.164062 55.167969 55.164062h81.710937c8.285157 0 15-6.71875 15-15v-120.5c0-13.878906 11.292969-25.167969 25.171875-25.167969h48.195313c13.878906 0 25.167969 11.289063 25.167969 25.167969v120.5c0 8.28125 6.714843 15 15 15h81.710937c30.421875 0 55.167969-24.746094 55.167969-55.164062v-153.695313h7.71875c12.585937 0 24.421875-4.902344 33.332031-13.8125 18.359375-18.367187 18.367187-48.253906.027344-66.632813zm-21.242188 45.421876c-3.238281 3.238281-7.542969 5.023437-12.117187 5.023437h-22.71875c-8.285156 0-15 6.714844-15 15v168.695313c0 13.875-11.289063 25.164062-25.167969 25.164062h-66.710937v-105.5c0-30.417969-24.746094-55.167969-55.167969-55.167969h-48.195313c-30.421875 0-55.171875 24.75-55.171875 55.167969v105.5h-66.710937c-13.875 0-25.167969-11.289062-25.167969-25.164062v-168.695313c0-8.285156-6.714844-15-15-15h-22.328125c-.234375-.015625-.464844-.027344-.703125-.03125-4.46875-.078125-8.660156-1.851563-11.800781-4.996094-6.679688-6.679687-6.679688-17.550781 0-24.234375.003906 0 .003906-.003906.007812-.007812l.011719-.011719 208.847656-208.839844c3.234375-3.238281 7.535157-5.019531 12.113281-5.019531 4.574219
								 0 8.875 1.78125 12.113282 5.019531l208.800781 208.796875c.03125.03125.066406.0625.097656.09375 6.644531 6.691406 6.632813 17.539063-.03125 24.207032zm0 0"/>
            			    </svg>
            			</NavigationButton>
						<NavigationButton
							title="Logout"
							onClick={logoutButtonHandler}
						>
                	        <svg
                	            xmlns="http://www.w3.org/2000/svg"
                	            viewBox="0 0 471.2 471.2"
                	        >
                	            <path d="M227.619,444.2h-122.9c-33.4,0-60.5-27.2-60.5-60.5V87.5c0-33.4,27.2-60.5,60.5-60.5h124.9c7.5,0,13.5-6,13.5-13.5
                	                s-6-13.5-13.5-13.5h-124.9c-48.3,0-87.5,39.3-87.5,87.5v296.2c0,48.3,39.3,87.5,87.5,87.5h122.9c7.5,0,13.5-6,13.5-13.5
                	                S235.019,444.2,227.619,444.2z"/>
                	            <path d="M450.019,226.1l-85.8-85.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l62.8,62.8h-273.9c-7.5,0-13.5,6-13.5,13.5
                	                s6,13.5,13.5,13.5h273.9l-62.8,62.8c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8
                	                C455.319,239.9,455.319,231.3,450.019,226.1z"/>
                	        </svg>
                	    </NavigationButton>
					</NavbarNavigationItems>
				</NavbarItem>
			</NavbarItems>
			<NavbarHambuerguerButton
				className="--align-bottom"
				onClick={navbarVisibilityHandler}
			>
				<svg 
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M501.333 54H10.667C4.779 54 0 61.8403 0 71.5C0 81.1597 4.779 89 10.667 89H501.334C507.222 89 512.001 81.1597 512.001 71.5C512.001 61.8403 507.221 54 501.333 54Z"/>
                    <path d="M501.333 245.333H10.667C4.779 245.333 0 253.173 0 262.833C0 272.493 4.779 280.333 10.667 280.333H501.334C507.222 280.333 512.001 272.493 512.001 262.833C512.001 253.173 507.221 245.333 501.333 245.333Z"/>
                    <path d="M501.333 437H10.667C4.779 437 0 444.839 0 454.499C0 464.159 4.779 472 10.667 472H501.334C507.222 472 512.001 464.159 512.001 454.499C512 444.839 507.221 437 501.333 437Z"/>
                </svg>
			</NavbarHambuerguerButton>
		</NavbarWrapper>
	);
};

export default Navbar;