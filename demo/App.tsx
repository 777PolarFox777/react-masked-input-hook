import * as React from 'react';
import './styles.scss';
import clsx from 'clsx';
import { boostrapReactLogoUrl, Libs, materialUILogoUrl } from './constants';
import { BootstrapDemo } from './BoostrapDemo';
import { MaterialDemo } from './MaterialDemo';

export const App = () => {
  const [lib, setLib] = React.useState<Libs>(Libs.Boostrap);

  return (
    <div className="demo-wrapper">
      <div className="demo-header-container">
        <h1 className="demo-header">React MaskedInput hook</h1>
        <div className="demo-lib-select">
          <button
            type="button"
            className={clsx('demo-lib-button', lib === Libs.Boostrap && 'selected')}
            onClick={() => setLib(Libs.Boostrap)}
            title="Boostrap components"
          >
            <img src={boostrapReactLogoUrl} alt="React Boostrap logo" />
          </button>
          {' '}
          <button
            type="button"
            className={clsx('demo-lib-button', lib === Libs.Material && 'selected')}
            onClick={() => setLib(Libs.Material)}
            title="Material components"
          >
            <img src={materialUILogoUrl} alt="Material-UI logo" />
          </button>
        </div>
      </div>
      <br />
      <div className="demo-content">
        {lib === Libs.Boostrap && (
          <BootstrapDemo />
        )}
        {lib === Libs.Material && (
          <MaterialDemo />
        )}
      </div>
    </div>
  );
};

App.displayName = 'App';
