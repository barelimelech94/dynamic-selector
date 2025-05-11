import './App.css';
import ExampleMultiSelectListboxDynamicSelector from './components/ExampleMultiSelectListboxDynamicSelector/ExampleMultiSelectListboxDynamicSelector';
import { mockSearchItems, mockGetItemsById } from './api/mockApi';

function App() {
    return (
        <div>
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={mockSearchItems}
                getItemsById={mockGetItemsById}
                initialSelectedIds={['56', '47']}
            />
        </div>
    );
}

export default App;
