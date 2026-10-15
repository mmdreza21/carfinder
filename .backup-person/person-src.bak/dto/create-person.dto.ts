import {
    IsArray,
    IsDateString,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreatePersonDto {
    @IsOptional() @IsString() fullName?: string;
    @IsOptional() @IsString() firstName?: string;
    @IsOptional() @IsString() lastName?: string;
    @IsOptional() @IsString() middleName?: string;
    @IsOptional() @IsString() middleInitial?: string;
    @IsOptional() @IsString() gender?: string;

    @IsOptional() @IsString() linkedinId?: string;
    @IsOptional() @IsString() linkedinUrl?: string;
    @IsOptional() @IsString() linkedinUsername?: string;

    @IsOptional() @IsString() facebookId?: string;
    @IsOptional() @IsString() facebookUrl?: string;
    @IsOptional() @IsString() facebookUsername?: string;

    @IsOptional() @IsString() twitterUrl?: string;
    @IsOptional() @IsString() twitterUsername?: string;

    @IsOptional() @IsString() githubUrl?: string;
    @IsOptional() @IsString() githubUsername?: string;

    @IsOptional() @IsString() industry?: string;
    @IsOptional() @IsString() jobTitle?: string;
    @IsOptional() @IsString() jobTitleRole?: string;
    @IsOptional() @IsString() jobTitleSubRole?: string;
    @IsOptional() @IsArray() jobTitleLevels?: string[];
    @IsOptional() @IsString() jobCompanyId?: string;
    @IsOptional() @IsString() jobCompanyName?: string;
    @IsOptional() @IsString() jobCompanyWebsite?: string;
    @IsOptional() @IsString() jobCompanySize?: string;
    @IsOptional() @IsInt() jobCompanyFounded?: number;
    @IsOptional() @IsString() jobCompanyIndustry?: string;
    @IsOptional() @IsString() jobCompanyLinkedinUrl?: string;
    @IsOptional() @IsString() jobCompanyLinkedinId?: string;
    @IsOptional() @IsString() jobCompanyFacebookUrl?: string;
    @IsOptional() @IsString() jobCompanyTwitterUrl?: string;

    @IsOptional() @IsString() jobCompanyLocationName?: string;
    @IsOptional() @IsString() jobCompanyLocationLocality?: string;
    @IsOptional() @IsString() jobCompanyLocationMetro?: string;
    @IsOptional() @IsString() jobCompanyLocationRegion?: string;
    @IsOptional() @IsString() jobCompanyLocationGeo?: string;
    @IsOptional() @IsString() jobCompanyLocationCountry?: string;
    @IsOptional() @IsString() jobCompanyLocationContinent?: string;
    @IsOptional() @IsString() jobCompanyLocationStreetAddress?: string;
    @IsOptional() @IsString() jobCompanyLocationPostalCode?: string;
    @IsOptional() @IsString() jobCompanyLocationAddressLine2?: string;

    @IsOptional() @IsString() jobStartDate?: string;
    @IsOptional() @IsDateString() jobLastUpdated?: string;
    @IsOptional() @IsString() jobSummary?: string;

    @IsOptional() @IsString() locationName?: string;
    @IsOptional() @IsString() locationLocality?: string;
    @IsOptional() @IsString() locationMetro?: string;
    @IsOptional() @IsString() locationRegion?: string;
    @IsOptional() @IsString() locationCountry?: string;
    @IsOptional() @IsString() locationContinent?: string;
    @IsOptional() @IsString() locationGeo?: string;
    @IsOptional() @IsDateString() locationLastUpdated?: string;
    @IsOptional() @IsString() locationStreetAddress?: string;
    @IsOptional() @IsString() locationPostalCode?: string;
    @IsOptional() @IsString() locationAddressLine2?: string;

    @IsOptional() @IsInt() linkedinConnections?: number;
    @IsOptional() @IsString() inferredSalary?: string;
    @IsOptional() @IsNumber() inferredYearsExperience?: number;

    @IsOptional() @IsString() summary?: string;

    @IsOptional() @IsArray() interests?: string[];
    @IsOptional() @IsArray() skills?: string[];
    @IsOptional() @IsArray() locationNames?: string[];
    @IsOptional() @IsArray() regions?: string[];
    @IsOptional() @IsArray() countries?: string[];

    // Nested/variable JSON blobs — left loose on purpose (raw dataset shape)
    @IsOptional() experience?: any;
    @IsOptional() education?: any;
    @IsOptional() emails?: any;
    @IsOptional() phoneNumbers?: any;
    @IsOptional() profiles?: any;
    @IsOptional() certifications?: any;
    @IsOptional() languages?: any;
    @IsOptional() versionStatus?: any;

    @IsOptional() @IsString() workEmail?: string;
    @IsOptional() @IsString() mobilePhone?: string;
    @IsOptional() @IsInt() birthYear?: number;
    @IsOptional() @IsDateString() birthDate?: string;
}