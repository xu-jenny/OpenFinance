import Input from '@/components/common/Input';
import SearchBar from '@/components/common/Searchbar';
import { post } from '@/components/common/util';
import DynamicTable from '@/components/home/DynamicTable';
import { TableName } from '@/components/home/SampleTable';
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';

const SampleTables = ({ tables }: { tables: any[] }) => {
  return (
    <div className="flex space-x-4">
      {tables.map((table, i) => (
        <div className="overflow-x-auto flex-shrink-0 w-1/2" key={i}>
          <DynamicTable data={table['data']} paginate={false} />
        </div>
      ))}
    </div>
  );
};

export default function Search() {
  const [tableNames, setTableNames] = useState<TableName[]>([]);
  const [tables, setTables] = useState<any[]>([]);

  const onInputSubmit = async (message: String) => {
    let response = await post('/api/search', { question: message });
    console.log(response);
    if ('tables' in response) {
      setTableNames(response['tables']);
    }
  };

  useEffect(() => {
    async function fetchData() {
      // const requests = tableNames.map((tableName) =>
      //   fetch(`/api/sample?name=${tableName}`).then((response) =>
      //     response.json(),
      //   ),
      // );

      // const fetchedData = await Promise.all(requests);
      // console.log(fetchedData.flat());
      const test = [
        {
          data: [
            {
              id: 1,
              createdAt: '2023-08-07T00:21:19.426Z',
              companyName: 'Dropbox, Inc.',
              noticeDate: '2023-04-27T00:00:00.000Z',
              layoffDate: '2023-04-28T00:00:00.000Z',
              numAffected: 182,
              state: 'CA',
            },
            {
              id: 2,
              createdAt: '2023-08-07T00:21:19.426Z',
              companyName: 'Lyft, Inc.',
              noticeDate: '2023-04-27T00:00:00.000Z',
              layoffDate: '2023-04-28T00:00:00.000Z',
              numAffected: 383,
              state: 'CA',
            },
            {
              id: 3,
              createdAt: '2023-08-07T00:21:19.426Z',
              companyName: 'Alteryx, Inc.',
              noticeDate: '2023-04-27T00:00:00.000Z',
              layoffDate: '2023-06-30T00:00:00.000Z',
              numAffected: 65,
              state: 'CA',
            },
            {
              id: 4,
              createdAt: '2023-08-07T00:21:19.426Z',
              companyName: 'Cal Poly Corporation',
              noticeDate: '2023-04-26T00:00:00.000Z',
              layoffDate: '2023-06-30T00:00:00.000Z',
              numAffected: 149,
              state: 'CA',
            },
            {
              id: 5,
              createdAt: '2023-08-07T00:21:19.426Z',
              companyName: 'Bed Bath & Beyond Store 0020',
              noticeDate: '2023-04-24T00:00:00.000Z',
              layoffDate: '2023-06-26T00:00:00.000Z',
              numAffected: 52,
              state: 'CA',
            },
          ],
        },
        {
          data: [
            {
              X: '-93.2969048626618',
              Y: '44.9259091240758',
              ID: 51961230,
              CaseNumber: '08-003643',
              ResponseDate: '2008-01-04T10:40:37.000Z',
              Problem: 'Suspicious Vehicle',
              Is911Call: false,
              PrimaryOffense: 'AOA',
              SubjectInjury: false,
              ForceReportNumber: '1',
              SubjectRole: 'OT',
              SubjectRoleNumber: '1',
              ForceType: 'Bodily Force',
              ForceTypeAction: 'Body Weight to Pin',
              Race: 'White',
              Sex: 'Male',
              EventAge: '31',
              TypeOfResistance: 'Unspecified',
              Precinct: '5',
              Neighborhood: 'East Harriet',
              TotalCityCallsForYear: 322402,
              TotalPrecinctCallsForYear: '55689',
              TotalNeighborhoodCallsForYear: 841,
              CenterGBSID: '18837',
              Latitude: 44.925909,
              Longitude: -93.296905,
              CenterX: '-10385763.9419',
              CenterY: '5609864.926',
              DateAdded: '2023-08-05T08:20:07.000Z',
              OBJECTID: 1,
            },
            {
              X: '-93.2911827793549',
              Y: '45.0185257224975',
              ID: 51961231,
              CaseNumber: '08-005343',
              ResponseDate: '2008-01-05T22:57:23.000Z',
              Problem: 'Suspicious Person',
              Is911Call: false,
              PrimaryOffense: 'FLEEFT',
              SubjectInjury: true,
              ForceReportNumber: '1',
              SubjectRole: 'A',
              SubjectRoleNumber: '1',
              ForceType: 'Bodily Force',
              ForceTypeAction: 'Punches',
              Race: 'Black',
              Sex: 'Male',
              EventAge: '29',
              TypeOfResistance: 'Fled on Foot',
              Precinct: '4',
              Neighborhood: 'McKinley',
              TotalCityCallsForYear: 322402,
              TotalPrecinctCallsForYear: '80434',
              TotalNeighborhoodCallsForYear: 4226,
              CenterGBSID: '18266',
              Latitude: 45.018526,
              Longitude: -93.291183,
              CenterX: '-10385126.9625',
              CenterY: '5624438.4537',
              DateAdded: '2023-08-05T08:20:07.000Z',
              OBJECTID: 2,
            },
            {
              X: '-93.3056975286453',
              Y: '45.0105188634693',
              ID: 51961232,
              CaseNumber: '08-015086',
              ResponseDate: '2008-01-15T18:56:27.000Z',
              Problem: 'Suspicious Person',
              Is911Call: false,
              PrimaryOffense: 'OBSTRU',
              SubjectInjury: false,
              ForceReportNumber: '1',
              SubjectRole: 'A',
              SubjectRoleNumber: '1',
              ForceType: 'Bodily Force',
              ForceTypeAction: 'Knees',
              Race: 'Black',
              Sex: 'Male',
              EventAge: '24',
              TypeOfResistance: 'Fled on Foot',
              Precinct: '4',
              Neighborhood: 'Jordan',
              TotalCityCallsForYear: 322402,
              TotalPrecinctCallsForYear: '80434',
              TotalNeighborhoodCallsForYear: 15344,
              CenterGBSID: '10711',
              Latitude: 45.010519,
              Longitude: -93.305698,
              CenterX: '-10386742.737',
              CenterY: '5623177.618',
              DateAdded: '2023-08-05T08:20:07.000Z',
              OBJECTID: 3,
            },
            {
              X: '-93.2719634055979',
              Y: '44.9816549707868',
              ID: 51961233,
              CaseNumber: '08-025804',
              ResponseDate: '2008-01-27T02:31:10.000Z',
              Problem: 'Assault in Progress',
              Is911Call: false,
              PrimaryOffense: 'ASLT4',
              SubjectInjury: true,
              ForceReportNumber: '1',
              SubjectRole: 'A',
              SubjectRoleNumber: '1',
              ForceType: 'Bodily Force',
              ForceTypeAction: 'Kicks',
              Race: 'Black',
              Sex: 'Male',
              EventAge: '32',
              TypeOfResistance: 'Assaulted Officer',
              Precinct: '1',
              Neighborhood: 'Downtown West',
              TotalCityCallsForYear: 322402,
              TotalPrecinctCallsForYear: '46998',
              TotalNeighborhoodCallsForYear: 23458,
              CenterGBSID: '17120',
              Latitude: 44.981655,
              Longitude: -93.271963,
              CenterX: '-10382987.4716',
              CenterY: '5618633.899',
              DateAdded: '2023-08-05T08:20:07.000Z',
              OBJECTID: 4,
            },
            {
              X: '-93.2533957712575',
              Y: '44.9888665302459',
              ID: 51961234,
              CaseNumber: '08-031711',
              ResponseDate: '2008-02-02T01:19:05.000Z',
              Problem: 'Poss Personal Injury Acc',
              Is911Call: true,
              PrimaryOffense: 'DWI',
              SubjectInjury: true,
              ForceReportNumber: '1',
              SubjectRole: 'A',
              SubjectRoleNumber: '1',
              ForceType: 'Bodily Force',
              ForceTypeAction: 'Knees',
              Race: 'Other / Mixed Race',
              Sex: 'Male',
              EventAge: '45',
              TypeOfResistance: 'Tensed',
              Precinct: '2',
              Neighborhood: 'Nicollet Island - East Bank',
              TotalCityCallsForYear: 322402,
              TotalPrecinctCallsForYear: '48901',
              TotalNeighborhoodCallsForYear: 4858,
              CenterGBSID: '19846',
              Latitude: 44.988867,
              Longitude: -93.253396,
              CenterX: '-10380920.532',
              CenterY: '5619768.9195',
              DateAdded: '2023-08-05T08:20:07.000Z',
              OBJECTID: 5,
            },
          ],
        },
      ];
      setTables(test);
    }

    fetchData();
  }, [tableNames]);

  return (
    <Layout>
      <h2>Search for your dataset</h2>
      <SearchBar />
      <Input onSubmit={onInputSubmit} />

      <div>
        <SampleTables tables={tables} />
      </div>
    </Layout>
  );
}
