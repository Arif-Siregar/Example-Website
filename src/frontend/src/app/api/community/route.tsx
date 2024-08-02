import queryString from 'query-string';
import prisma from '../../../utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '../../../components/Sanitiser';


export async function GET(req: NextRequest) {
    
  //sanitise the parameters:
  const queryParams = queryString.parseUrl(req.url).query;

  // first determine the council id associated with that council name:
  const homeCouncil = sanitizeInput(queryParams.selectedCouncil);
  if (!homeCouncil || homeCouncil === "") {
    return NextResponse.json({ "error": "The 'specificCouncil' parameter is missing or null" });
}
const homeID = await prisma.council.findFirst({
    where: {
        name: homeCouncil as string,
    },
    select: {
        id: true,
    }
})
if (homeID == null) {
    return NextResponse.json({ "error": "requesting bins do not have a valid council (not found)" })
}

if(homeID != null){
    const communityList = await prisma.community.findMany({
      where :{
          councilId : homeID.id,
      },
      select:{
        Community_communitytype_mappings:{
            
        },communityId:true,location:true,name:true,link:true,frequency:true,notes:true
      }
     })
    if (communityList == null) {
        return NextResponse.json({ "error": "No data found!" })
    }
    else {
        //return NextResponse.json({ "error": "No data found!" })
        return NextResponse.json(communityList);
    }
}

}