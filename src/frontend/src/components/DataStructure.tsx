// format of extracted data in fetchCouncil API
// For home council selections:
export interface councilStructure {
    postcode: string;
    name: string;
    council: {
        name: string;
    };
}

// For extraction of bins based on a speciifc council: 
export interface SpecificBinsStructure {
    type: string,
    can: string,
    cannot: string,
}

// format for extracted item reclycing details
export interface Method {
    method: string | null;
    note: string | null;
    address: string | null;
    bin: {
        type: string;
    } | null; // possibly null for drop off methods
}

export interface SpecificItemsStructure {
    name: string;
    methods: Method[];
}
