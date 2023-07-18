import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetOrganisationById } from "../../services/organisationService";
import { RootState } from "../../store";
import { AiOutlineWarning } from "react-icons/ai"
import { FcOrganization } from "react-icons/fc"
import { useNavigate } from "react-router-dom";
const OrganizationClient: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const Navigate = useNavigate()

  const [organization, setOrganization] = useState<any>({});

  const getOrganiz = async () => {
    if (user.organizationId !== null) {
      try {
       
        const { data, status } = await GetOrganisationById(user.organizationId)
        setOrganization(data.result.organization)
      } catch (error) {
        console.log(error);
      }
    }

  }
  const navigateOrganization = () => {

    Navigate(`/client/editorganization/${user.organizationId}`)

  }
  useEffect(() => {
    getOrganiz()
  }, [])
  if (user.organizationId !== null) {
    return (
      
       <>
              
                  
              {/* <FcOrganization size="5rem" /> */}
              <div className="userProfileInfo text-center">
                <div className="m-4" ><h6 className="text-customColor">نام سازمان</h6><b>{organization.name}</b></div>
                <div className="m-4" ><h6 className="text-customColor">شناسه ملی </h6> <b>{organization.nationalId}</b></div>
                <div className="m-4" ><h6 className="text-customColor">شماره ثبت سازمان</h6><b>{organization.registrationNumber}</b></div>
                <div className="m-3" ><h6 className="text-customColor">  </h6><b></b></div>
              </div>
               <div className="user-info-list">
              <div className="editProfileBtn">
              
              </div>

          </div> 
            </>
      
        
        
        )
  } else {
  return (<div className="text-center  p-3">
    <AiOutlineWarning size="5rem " color="gold" />
    <div>اطلاعاتی برای نمایش وجود ندارد</div>
  </div>)

}

}
export default OrganizationClient