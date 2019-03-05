import {Enum} from 'enumify';

class WebServiceErrorStatusesEnum extends Enum {}
WebServiceErrorStatusesEnum.initEnum(['FileNotExist', 'FileAlreadyExists', "DifferentAddError", "DifferentGetError"]);

export default WebServiceErrorStatusesEnum;