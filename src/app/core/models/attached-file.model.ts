export interface AttachedFile {
  id: number;
  name: string;
  type: string;
  size: number;
  icon: string;
}

export interface Document{
  id: number;
	referenceId: number;
	title: string;
	description: string;
	docName: string;
	docExt: string;
  docSize: number;
  docType: string;
}

